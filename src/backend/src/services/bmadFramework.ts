/**
 * BMad v6 Framework Integration Service
 * Handles integration with BMad v6 agents, templates, and workflows
 * Story 1.4: BMad Framework Integration Foundation
 */

import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { FastifyInstance } from 'fastify';

export interface BMadAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  contextRequirements: string[];
  priority: number;
  phase?: string;
  track?: string;
}

export interface BMadTemplate {
  id: string;
  name: string;
  type: string;
  phase: string;
  track: string;
  description: string;
  filePath: string;
  metadata: Record<string, any>;
}

export interface BMadWorkflow {
  id: string;
  name: string;
  type: 'quick_flow' | 'bmad_method' | 'brownfield';
  phases: BMadPhase[];
  description: string;
}

export interface BMadPhase {
  id: string;
  name: string;
  order: number;
  description: string;
  requiredArtifacts: string[];
  outputArtifacts: string[];
  agents: string[];
  completionCriteria: string[];
}

export interface WorkflowInstance {
  id: string;
  userId: string;
  projectId?: string;
  workflowType: string;
  currentPhase: string;
  phaseProgress: Record<string, any>;
  workflowState: Record<string, any>;
  activeAgents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class BMadFrameworkService {
  private frameworkPath: string;
  private agents: Map<string, BMadAgent> = new Map();
  private templates: Map<string, BMadTemplate> = new Map();
  private workflows: Map<string, BMadWorkflow> = new Map();
  private isInitialized: boolean = false;
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance, frameworkPath?: string) {
    this.fastify = fastify;
    this.frameworkPath = frameworkPath || path.join(process.cwd(), 'bmm');
  }

  // AC1: Agent Definition Loading Capabilities
  async loadAgentDefinitions(): Promise<Map<string, BMadAgent>> {
    try {
      const agentsPath = path.join(this.frameworkPath, 'agents');
      const agentFiles = await fs.readdir(agentsPath);

      const agents = new Map<string, BMadAgent>();

      for (const file of agentFiles) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(agentsPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const agent = this.parseAgentDefinition(file, content);

        if (agent) {
          agents.set(agent.id, agent);
          this.fastify.logger.info(`Loaded BMad agent: ${agent.id}`);
        }
      }

      // Cache agents in memory
      this.agents = agents;

      this.fastify.logger.info(`Successfully loaded ${agents.size} BMad v6 agents`);
      return agents;
    } catch (error) {
      this.fastify.logger.error('Failed to load BMad agent definitions:', error);
      throw new Error(`Agent loading failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private parseAgentDefinition(fileName: string, content: string): BMadAgent | null {
    try {
      const agentId = path.basename(fileName, '.md');

      // Extract agent metadata from markdown
      const lines = content.split('\n');
      let name = '';
      let role = '';
      let description = '';
      const capabilities: string[] = [];
      const contextRequirements: string[] = [];

      // Parse markdown content for agent information
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('# ')) {
          name = line.substring(2).trim();
        } else if (line.includes('Role:') || line.includes('**Role:**')) {
          role = line.replace(/\*\*(Role:?)\*\*/, '').replace('Role:', '').trim();
        } else if (line.includes('Description:') || line.includes('**Description:**')) {
          description = lines[i + 1]?.trim() || line.replace(/\*\*(Description:?)\*\*/, '').replace('Description:', '').trim();
        } else if (line.includes('Capabilities:') || line.includes('**Capabilities:**')) {
          // Parse capabilities list
          for (let j = i + 1; j < lines.length && lines[j].startsWith('-'); j++) {
            capabilities.push(lines[j].substring(1).trim());
          }
        } else if (line.includes('Context Requirements:') || line.includes('**Context Requirements:**')) {
          // Parse context requirements
          for (let j = i + 1; j < lines.length && lines[j].startsWith('-'); j++) {
            contextRequirements.push(lines[j].substring(1).trim());
          }
        }
      }

      return {
        id: agentId,
        name: name || agentId,
        role: role || 'General Purpose',
        description: description || `${agentId} agent`,
        capabilities,
        contextRequirements,
        priority: this.getAgentPriority(agentId),
        phase: this.getAgentPhase(agentId),
        track: this.getAgentTrack(agentId)
      };
    } catch (error) {
      this.fastify.logger.error(`Failed to parse agent definition for ${fileName}:`, error);
      return null;
    }
  }

  private getAgentPriority(agentId: string): number {
    // Priority mapping based on BMad v6 framework
    const priorities: Record<string, number> = {
      'pm': 10,       // Project Manager - highest priority
      'analyst': 9,   // Business Analyst
      'architect': 8, // Solution Architect
      'dev': 7,       // Developer
      'tea': 6,       // Technical Engineering Assistant
      'ux-designer': 5,
      'tech-writer': 4,
      'sm': 3         // Scrum Master
    };
    return priorities[agentId] || 1;
  }

  private getAgentPhase(agentId: string): string {
    // Phase mapping for context-aware loading
    const phases: Record<string, string> = {
      'analyst': 'analysis',
      'pm': 'planning',
      'architect': 'solutioning',
      'dev': 'implementation',
      'tea': 'implementation',
      'ux-designer': 'solutioning',
      'tech-writer': 'implementation',
      'sm': 'planning'
    };
    return phases[agentId] || 'all';
  }

  private getAgentTrack(agentId: string): string {
    // Track compatibility
    return 'all'; // Most agents work across all tracks
  }

  // AC2: Template System Access
  async loadTemplateSystem(): Promise<Map<string, BMadTemplate>> {
    try {
      const templates = new Map<string, BMadTemplate>();

      // Load templates from workflow directories
      const workflowsPath = path.join(this.frameworkPath, 'workflows');
      const phases = await fs.readdir(workflowsPath);

      for (const phase of phases) {
        const phasePath = path.join(workflowsPath, phase);
        const stat = await fs.stat(phasePath);

        if (stat.isDirectory()) {
          await this.loadPhaseTemplates(phasePath, phase, templates);
        }
      }

      // Load from docs directory
      const docsPath = path.join(this.frameworkPath, 'docs');
      try {
        await this.loadDocsTemplates(docsPath, templates);
      } catch (error) {
        this.fastify.logger.warn('Docs templates not found, continuing without them');
      }

      this.templates = templates;
      this.fastify.logger.info(`Successfully loaded ${templates.size} BMad v6 templates`);
      return templates;
    } catch (error) {
      this.fastify.logger.error('Failed to load BMad template system:', error);
      throw new Error(`Template loading failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async loadPhaseTemplates(phasePath: string, phase: string, templates: Map<string, BMadTemplate>) {
    try {
      const files = await fs.readdir(phasePath, { recursive: true });

      for (const file of files) {
        const fullPath = path.join(phasePath, file as string);
        const stat = await fs.stat(fullPath);

        if (stat.isFile() && (file.toString().endsWith('.md') || file.toString().endsWith('.yaml'))) {
          const template = await this.parseTemplateFile(fullPath, phase);
          if (template) {
            templates.set(template.id, template);
          }
        }
      }
    } catch (error) {
      this.fastify.logger.warn(`Could not load templates from ${phasePath}:`, error);
    }
  }

  private async loadDocsTemplates(docsPath: string, templates: Map<string, BMadTemplate>) {
    try {
      const files = await fs.readdir(docsPath);

      for (const file of files) {
        if (file.endsWith('.md') || file.endsWith('.yaml')) {
          const filePath = path.join(docsPath, file);
          const template = await this.parseTemplateFile(filePath, 'documentation');
          if (template) {
            templates.set(template.id, template);
          }
        }
      }
    } catch (error) {
      this.fastify.logger.warn('Could not load docs templates:', error);
    }
  }

  private async parseTemplateFile(filePath: string, phase: string): Promise<BMadTemplate | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const fileName = path.basename(filePath);
      const templateId = fileName.replace(/\.(md|yaml)$/, '');

      let templateType = 'document';
      let description = '';

      if (fileName.includes('prd')) templateType = 'prd';
      else if (fileName.includes('architecture')) templateType = 'architecture';
      else if (fileName.includes('story')) templateType = 'user-story';
      else if (fileName.includes('test')) templateType = 'test';
      else if (fileName.includes('workflow')) templateType = 'workflow';

      // Extract description from content
      const lines = content.split('\n');
      for (const line of lines.slice(0, 10)) {
        if (line.startsWith('# ')) {
          description = line.substring(2).trim();
          break;
        }
      }

      return {
        id: templateId,
        name: templateId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: templateType,
        phase,
        track: 'all',
        description: description || `${templateType} template`,
        filePath,
        metadata: {
          size: content.length,
          lastModified: (await fs.stat(filePath)).mtime
        }
      };
    } catch (error) {
      this.fastify.logger.error(`Failed to parse template ${filePath}:`, error);
      return null;
    }
  }

  // AC3: Workflow Definition Integration
  async loadWorkflowDefinitions(): Promise<Map<string, BMadWorkflow>> {
    try {
      const workflows = new Map<string, BMadWorkflow>();

      // Create BMad v6 standard workflows
      const quickFlow = this.createQuickFlowWorkflow();
      const bmadMethod = this.createBMadMethodWorkflow();
      const brownfield = this.createBrownfieldWorkflow();

      workflows.set(quickFlow.id, quickFlow);
      workflows.set(bmadMethod.id, bmadMethod);
      workflows.set(brownfield.id, brownfield);

      this.workflows = workflows;
      this.fastify.logger.info(`Successfully loaded ${workflows.size} BMad v6 workflows`);
      return workflows;
    } catch (error) {
      this.fastify.logger.error('Failed to load BMad workflow definitions:', error);
      throw new Error(`Workflow loading failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private createQuickFlowWorkflow(): BMadWorkflow {
    return {
      id: 'quick_flow',
      name: 'Quick Flow',
      type: 'quick_flow',
      description: 'Rapid prototyping and validation workflow',
      phases: [
        {
          id: 'analysis',
          name: 'Quick Analysis',
          order: 1,
          description: 'Rapid problem understanding and scope definition',
          requiredArtifacts: [],
          outputArtifacts: ['brief', 'requirements'],
          agents: ['analyst', 'pm'],
          completionCriteria: ['Problem defined', 'Scope established']
        },
        {
          id: 'planning',
          name: 'Rapid Planning',
          order: 2,
          description: 'Quick solution approach and timeline',
          requiredArtifacts: ['brief'],
          outputArtifacts: ['plan', 'timeline'],
          agents: ['pm', 'architect'],
          completionCriteria: ['Solution approach defined', 'Timeline created']
        },
        {
          id: 'solutioning',
          name: 'Quick Solution Design',
          order: 3,
          description: 'Essential solution architecture',
          requiredArtifacts: ['plan'],
          outputArtifacts: ['architecture', 'design'],
          agents: ['architect', 'dev'],
          completionCriteria: ['Architecture defined', 'Design approved']
        },
        {
          id: 'implementation',
          name: 'Quick Implementation',
          order: 4,
          description: 'Rapid development and validation',
          requiredArtifacts: ['architecture'],
          outputArtifacts: ['prototype', 'validation'],
          agents: ['dev', 'tea'],
          completionCriteria: ['Prototype complete', 'Validation successful']
        }
      ]
    };
  }

  private createBMadMethodWorkflow(): BMadWorkflow {
    return {
      id: 'bmad_method',
      name: 'BMad Method',
      type: 'bmad_method',
      description: 'Complete BMad v6 methodology workflow',
      phases: [
        {
          id: 'analysis',
          name: 'Comprehensive Analysis',
          order: 1,
          description: 'Deep business and technical analysis',
          requiredArtifacts: [],
          outputArtifacts: ['business-case', 'requirements', 'stakeholder-analysis'],
          agents: ['analyst', 'pm', 'architect'],
          completionCriteria: ['Business case approved', 'Requirements validated', 'Stakeholders engaged']
        },
        {
          id: 'planning',
          name: 'Detailed Planning',
          order: 2,
          description: 'Comprehensive project planning and design',
          requiredArtifacts: ['business-case', 'requirements'],
          outputArtifacts: ['project-plan', 'resource-plan', 'risk-assessment'],
          agents: ['pm', 'sm', 'architect'],
          completionCriteria: ['Project plan approved', 'Resources allocated', 'Risks mitigated']
        },
        {
          id: 'solutioning',
          name: 'Solution Architecture',
          order: 3,
          description: 'Detailed solution design and architecture',
          requiredArtifacts: ['project-plan'],
          outputArtifacts: ['architecture', 'technical-design', 'user-experience'],
          agents: ['architect', 'ux-designer', 'tech-writer'],
          completionCriteria: ['Architecture approved', 'Design validated', 'UX approved']
        },
        {
          id: 'implementation',
          name: 'Full Implementation',
          order: 4,
          description: 'Complete development and deployment',
          requiredArtifacts: ['architecture', 'technical-design'],
          outputArtifacts: ['application', 'tests', 'documentation', 'deployment'],
          agents: ['dev', 'tea', 'tech-writer', 'sm'],
          completionCriteria: ['Application complete', 'Tests passed', 'Documentation complete', 'Deployment successful']
        }
      ]
    };
  }

  private createBrownfieldWorkflow(): BMadWorkflow {
    return {
      id: 'brownfield',
      name: 'Brownfield Integration',
      type: 'brownfield',
      description: 'Legacy system integration and modernization',
      phases: [
        {
          id: 'analysis',
          name: 'Legacy Analysis',
          order: 1,
          description: 'Analysis of existing systems and integration points',
          requiredArtifacts: [],
          outputArtifacts: ['legacy-assessment', 'integration-analysis', 'migration-strategy'],
          agents: ['analyst', 'architect', 'dev'],
          completionCriteria: ['Legacy systems assessed', 'Integration points identified', 'Migration strategy defined']
        },
        {
          id: 'planning',
          name: 'Integration Planning',
          order: 2,
          description: 'Planning integration approach and modernization',
          requiredArtifacts: ['legacy-assessment'],
          outputArtifacts: ['integration-plan', 'modernization-roadmap', 'risk-mitigation'],
          agents: ['pm', 'architect', 'sm'],
          completionCriteria: ['Integration plan approved', 'Roadmap established', 'Risks addressed']
        },
        {
          id: 'solutioning',
          name: 'Integration Design',
          order: 3,
          description: 'Design integration architecture and modernization approach',
          requiredArtifacts: ['integration-plan'],
          outputArtifacts: ['integration-architecture', 'api-design', 'data-migration-design'],
          agents: ['architect', 'dev', 'tech-writer'],
          completionCriteria: ['Integration architecture approved', 'APIs designed', 'Data migration planned']
        },
        {
          id: 'implementation',
          name: 'Integration Implementation',
          order: 4,
          description: 'Implement integration and modernization',
          requiredArtifacts: ['integration-architecture'],
          outputArtifacts: ['integration-solution', 'migration-tools', 'updated-documentation'],
          agents: ['dev', 'tea', 'tech-writer'],
          completionCriteria: ['Integration complete', 'Migration successful', 'Documentation updated']
        }
      ]
    };
  }

  // AC4: Agent Configuration Synchronization
  async synchronizeAgentConfigurations(userRole: string): Promise<BMadAgent[]> {
    try {
      const availableAgents = Array.from(this.agents.values());

      // Filter agents based on user role and permissions
      const accessibleAgents = availableAgents.filter(agent => {
        return this.validateAgentAccess(agent, userRole);
      });

      // Sort by priority
      accessibleAgents.sort((a, b) => b.priority - a.priority);

      this.fastify.logger.info(`Synchronized ${accessibleAgents.length} agents for role: ${userRole}`);
      return accessibleAgents;
    } catch (error) {
      this.fastify.logger.error('Failed to synchronize agent configurations:', error);
      throw new Error(`Agent synchronization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private validateAgentAccess(agent: BMadAgent, userRole: string): boolean {
    // Role-based agent access control
    const rolePermissions: Record<string, string[]> = {
      'admin': ['pm', 'analyst', 'architect', 'dev', 'tea', 'ux-designer', 'tech-writer', 'sm'],
      'project_manager': ['pm', 'analyst', 'sm', 'tech-writer'],
      'developer': ['dev', 'tea', 'architect'],
      'business_analyst': ['analyst', 'pm', 'ux-designer'],
      'architect': ['architect', 'dev', 'tea', 'tech-writer'],
      'user': ['analyst'] // Limited access for general users
    };

    const allowedAgents = rolePermissions[userRole] || rolePermissions['user'];
    return allowedAgents.includes(agent.id);
  }

  // AC5: Context-Aware Loading Preparation
  async getContextAwareAgents(
    projectPhase: string,
    projectComplexity: 'low' | 'medium' | 'high',
    userRole: string
  ): Promise<BMadAgent[]> {
    try {
      const allAgents = await this.synchronizeAgentConfigurations(userRole);

      // Filter by phase relevance
      const phaseRelevantAgents = allAgents.filter(agent =>
        agent.phase === projectPhase || agent.phase === 'all'
      );

      // Apply complexity-based filtering
      let selectedAgents = phaseRelevantAgents;

      if (projectComplexity === 'low') {
        selectedAgents = phaseRelevantAgents.slice(0, 2); // Top 2 agents
      } else if (projectComplexity === 'medium') {
        selectedAgents = phaseRelevantAgents.slice(0, 3); // Top 3 agents
      } else {
        selectedAgents = phaseRelevantAgents.slice(0, 5); // Top 5 agents for high complexity
      }

      this.fastify.logger.info(`Selected ${selectedAgents.length} context-aware agents for phase: ${projectPhase}, complexity: ${projectComplexity}`);
      return selectedAgents;
    } catch (error) {
      this.fastify.logger.error('Failed to get context-aware agents:', error);
      throw new Error(`Context-aware loading failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Initialization method
  async initialize(): Promise<void> {
    try {
      this.fastify.logger.info('Initializing BMad v6 Framework Integration...');

      // Load all framework components
      await Promise.all([
        this.loadAgentDefinitions(),
        this.loadTemplateSystem(),
        this.loadWorkflowDefinitions()
      ]);

      this.isInitialized = true;
      this.fastify.logger.info('BMad v6 Framework Integration initialized successfully');
    } catch (error) {
      this.fastify.logger.error('BMad v6 Framework initialization failed:', error);
      throw error;
    }
  }

  // Health check method
  getIntegrationHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    agents: number;
    templates: number;
    workflows: number;
    initialized: boolean;
  } {
    return {
      status: this.isInitialized ? 'healthy' : 'unhealthy',
      agents: this.agents.size,
      templates: this.templates.size,
      workflows: this.workflows.size,
      initialized: this.isInitialized
    };
  }

  // Getters for framework components
  getAgents(): Map<string, BMadAgent> { return this.agents; }
  getTemplates(): Map<string, BMadTemplate> { return this.templates; }
  getWorkflows(): Map<string, BMadWorkflow> { return this.workflows; }
  getAgent(id: string): BMadAgent | undefined { return this.agents.get(id); }
  getTemplate(id: string): BMadTemplate | undefined { return this.templates.get(id); }
  getWorkflow(id: string): BMadWorkflow | undefined { return this.workflows.get(id); }
}