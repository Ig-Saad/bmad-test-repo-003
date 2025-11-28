import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

interface BMadAgent {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  phase: string[];
  description: string;
  contextRequirements: string[];
  metadata: Record<string, any>;
}

interface BMadTemplate {
  id: string;
  name: string;
  type: string;
  phase: string;
  track: string[];
  content: string;
  metadata: Record<string, any>;
}

interface BMadWorkflow {
  id: string;
  name: string;
  type: 'quick_flow' | 'bmad_method' | 'brownfield';
  phases: string[];
  phaseTransitions: Record<string, string[]>;
  metadata: Record<string, any>;
}

interface BMadFrameworkData {
  agents: BMadAgent[];
  templates: BMadTemplate[];
  workflows: BMadWorkflow[];
  config: Record<string, any>;
}

const bmadFrameworkPlugin: FastifyPluginAsync = async (fastify) => {
  let frameworkData: BMadFrameworkData | null = null;
  let lastLoadTime: Date | null = null;

  // Helper function to load agent definitions
  const loadAgentDefinitions = async (): Promise<BMadAgent[]> => {
    const agents: BMadAgent[] = [];
    const agentsDir = path.join(process.cwd(), '../../bmm/agents');

    try {
      const agentFiles = await fs.readdir(agentsDir);

      for (const file of agentFiles) {
        if (file.endsWith('.md')) {
          const agentId = file.replace('.md', '');
          const filePath = path.join(agentsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');

          // Parse agent markdown to extract metadata
          const agent = parseAgentMarkdown(agentId, content);
          agents.push(agent);
        }
      }
    } catch (error) {
      fastify.logger.error('Failed to load agent definitions:', error);
      throw new Error('Agent definitions could not be loaded');
    }

    return agents;
  };

  // Helper function to parse agent markdown content
  const parseAgentMarkdown = (id: string, content: string): BMadAgent => {
    const lines = content.split('\n');
    let name = id;
    let role = '';
    let description = '';
    const capabilities: string[] = [];
    const phase: string[] = [];
    const contextRequirements: string[] = [];

    // Extract agent information from markdown
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('# ')) {
        name = line.substring(2).trim();
      } else if (line.startsWith('## Role') || line.startsWith('## Overview')) {
        // Get the next non-empty line as role description
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim()) {
            role = lines[j].trim();
            break;
          }
        }
      } else if (line.startsWith('## Description') || line.startsWith('## Purpose')) {
        // Get description from next few lines
        for (let j = i + 1; j < lines.length && j < i + 5; j++) {
          if (lines[j].trim() && !lines[j].startsWith('#')) {
            description += lines[j].trim() + ' ';
          }
        }
      } else if (line.includes('Phase:') || line.includes('Phases:')) {
        // Extract phases
        const phaseMatch = line.match(/Phase[s]?:\s*(.+)/i);
        if (phaseMatch) {
          const phases = phaseMatch[1].split(',').map(p => p.trim().toLowerCase());
          phase.push(...phases);
        }
      } else if (line.startsWith('- ') && (
        lines[i-1]?.includes('Capabilities') ||
        lines[i-1]?.includes('Responsibilities') ||
        lines[i-2]?.includes('Capabilities') ||
        lines[i-2]?.includes('Responsibilities')
      )) {
        capabilities.push(line.substring(2).trim());
      }
    }

    // Default phases if not specified
    if (phase.length === 0) {
      switch (id) {
        case 'analyst':
        case 'ux-designer':
          phase.push('analysis');
          break;
        case 'pm':
        case 'sm':
          phase.push('planning');
          break;
        case 'architect':
        case 'tech-writer':
          phase.push('solutioning');
          break;
        case 'dev':
        case 'tea':
          phase.push('implementation');
          break;
        default:
          phase.push('analysis', 'planning', 'solutioning', 'implementation');
      }
    }

    return {
      id,
      name: name || id,
      role: role || `BMad v6 ${id} agent`,
      capabilities,
      phase,
      description: description.trim(),
      contextRequirements: contextRequirements.length > 0 ? contextRequirements : ['project_context', 'user_requirements'],
      metadata: {
        source: 'bmm_framework',
        version: '6.0.0-alpha',
        loadedAt: new Date().toISOString()
      }
    };
  };

  // Helper function to load template definitions
  const loadTemplateDefinitions = async (): Promise<BMadTemplate[]> => {
    const templates: BMadTemplate[] = [];

    // Define standard BMad v6 templates
    const standardTemplates = [
      {
        id: 'project-brief',
        name: 'Project Brief',
        type: 'PROJECT_BRIEF',
        phase: 'analysis',
        track: ['quick_flow', 'bmad_method', 'brownfield'],
        content: `# Project Brief Template\n\n## Project Overview\n\n## Objectives\n\n## Scope\n\n## Success Criteria\n\n## Constraints\n\n## Stakeholders`,
        metadata: { required: true, complexity: 'basic' }
      },
      {
        id: 'prd',
        name: 'Product Requirements Document',
        type: 'PRD',
        phase: 'analysis',
        track: ['bmad_method', 'brownfield'],
        content: `# Product Requirements Document\n\n## Executive Summary\n\n## Product Vision\n\n## User Stories\n\n## Functional Requirements\n\n## Non-Functional Requirements\n\n## Technical Constraints`,
        metadata: { required: true, complexity: 'advanced' }
      },
      {
        id: 'architecture',
        name: 'Technical Architecture',
        type: 'ARCHITECTURE',
        phase: 'solutioning',
        track: ['bmad_method', 'brownfield'],
        content: `# Technical Architecture Document\n\n## System Overview\n\n## Architecture Principles\n\n## System Components\n\n## Data Flow\n\n## Security Architecture\n\n## Deployment Architecture`,
        metadata: { required: true, complexity: 'advanced' }
      },
      {
        id: 'user-stories',
        name: 'User Stories',
        type: 'USER_STORIES',
        phase: 'planning',
        track: ['quick_flow', 'bmad_method', 'brownfield'],
        content: `# User Stories\n\n## Epic 1: [Epic Name]\n\n### Story 1.1: [Story Name]\n**As a** [user type]\n**I want** [functionality]\n**So that** [benefit]\n\n#### Acceptance Criteria\n- [ ] Criterion 1\n- [ ] Criterion 2`,
        metadata: { required: true, complexity: 'intermediate' }
      },
      {
        id: 'test-plan',
        name: 'Test Plan',
        type: 'TEST_PLAN',
        phase: 'implementation',
        track: ['bmad_method', 'brownfield'],
        content: `# Test Plan\n\n## Test Strategy\n\n## Test Scope\n\n## Test Cases\n\n## Test Environment\n\n## Test Schedule\n\n## Risk Assessment`,
        metadata: { required: false, complexity: 'intermediate' }
      }
    ];

    for (const template of standardTemplates) {
      templates.push({
        ...template,
        metadata: {
          ...template.metadata,
          source: 'bmad_framework',
          version: '6.0.0-alpha',
          loadedAt: new Date().toISOString()
        }
      });
    }

    return templates;
  };

  // Helper function to load workflow definitions
  const loadWorkflowDefinitions = async (): Promise<BMadWorkflow[]> => {
    const workflows: BMadWorkflow[] = [
      {
        id: 'quick-flow',
        name: 'Quick Flow',
        type: 'quick_flow',
        phases: ['analysis', 'planning', 'implementation'],
        phaseTransitions: {
          'analysis': ['planning'],
          'planning': ['implementation'],
          'implementation': []
        },
        metadata: {
          description: 'Rapid development track for simple projects',
          complexity: 'low',
          duration: '1-2 weeks',
          agentCount: '2-3'
        }
      },
      {
        id: 'bmad-method',
        name: 'BMad Method',
        type: 'bmad_method',
        phases: ['analysis', 'planning', 'solutioning', 'implementation'],
        phaseTransitions: {
          'analysis': ['planning'],
          'planning': ['solutioning'],
          'solutioning': ['implementation'],
          'implementation': []
        },
        metadata: {
          description: 'Full BMad v6 methodology for complex projects',
          complexity: 'high',
          duration: '4-12 weeks',
          agentCount: '6-12'
        }
      },
      {
        id: 'brownfield',
        name: 'Brownfield',
        type: 'brownfield',
        phases: ['analysis', 'planning', 'solutioning', 'implementation'],
        phaseTransitions: {
          'analysis': ['planning'],
          'planning': ['solutioning'],
          'solutioning': ['implementation'],
          'implementation': []
        },
        metadata: {
          description: 'Legacy system modernization track',
          complexity: 'high',
          duration: '8-24 weeks',
          agentCount: '8-12'
        }
      }
    ];

    return workflows;
  };

  // Helper function to load BMad configuration
  const loadBMadConfig = async (): Promise<Record<string, any>> => {
    try {
      const configPath = path.join(process.cwd(), '../../bmm/config.yaml');
      const configContent = await fs.readFile(configPath, 'utf-8');
      return yaml.load(configContent) as Record<string, any>;
    } catch (error) {
      fastify.logger.warn('Could not load BMad config, using defaults:', error);
      return {
        project_name: 'BMad_v6_Platform',
        user_skill_level: 'intermediate',
        bmad_folder: 'bmm',
        version: '6.0.0-alpha'
      };
    }
  };

  // Main function to load all framework data
  const loadFrameworkData = async (): Promise<BMadFrameworkData> => {
    fastify.logger.info('Loading BMad v6 framework data...');

    const startTime = Date.now();

    try {
      const [agents, templates, workflows, config] = await Promise.all([
        loadAgentDefinitions(),
        loadTemplateDefinitions(),
        loadWorkflowDefinitions(),
        loadBMadConfig()
      ]);

      const data: BMadFrameworkData = {
        agents,
        templates,
        workflows,
        config
      };

      const loadTime = Date.now() - startTime;
      fastify.logger.info(`BMad v6 framework loaded successfully in ${loadTime}ms:`, {
        agents: agents.length,
        templates: templates.length,
        workflows: workflows.length
      });

      // Cache in Redis
      if (fastify.redis) {
        try {
          await fastify.redis.setEx('bmad:framework:data', 3600, JSON.stringify(data));
          await fastify.redis.setEx('bmad:framework:loaded_at', 3600, new Date().toISOString());
        } catch (error) {
          fastify.logger.warn('Failed to cache framework data in Redis:', error);
        }
      }

      return data;
    } catch (error) {
      fastify.logger.error('Failed to load BMad v6 framework:', error);
      throw error;
    }
  };

  // Helper function to get cached or fresh framework data
  const getFrameworkData = async (): Promise<BMadFrameworkData> => {
    // Try to get from memory cache first
    if (frameworkData && lastLoadTime && Date.now() - lastLoadTime.getTime() < 300000) { // 5 minutes
      return frameworkData;
    }

    // Try to get from Redis cache
    if (fastify.redis) {
      try {
        const cachedData = await fastify.redis.get('bmad:framework:data');
        if (cachedData) {
          frameworkData = JSON.parse(cachedData);
          lastLoadTime = new Date();
          return frameworkData!;
        }
      } catch (error) {
        fastify.logger.warn('Could not retrieve cached framework data:', error);
      }
    }

    // Load fresh data
    frameworkData = await loadFrameworkData();
    lastLoadTime = new Date();
    return frameworkData;
  };

  // Context-aware agent selection
  const selectContextualAgents = async (phase: string, complexity: 'low' | 'medium' | 'high', userRole: string) => {
    const data = await getFrameworkData();

    // Filter agents by phase
    const phaseAgents = data.agents.filter(agent => agent.phase.includes(phase));

    // Select 2-3 most relevant agents based on context
    let selectedAgents = phaseAgents;

    if (complexity === 'low') {
      // For low complexity, prefer core agents
      selectedAgents = phaseAgents.slice(0, 2);
    } else if (complexity === 'medium') {
      // For medium complexity, include specialist agents
      selectedAgents = phaseAgents.slice(0, 3);
    } else {
      // For high complexity, include all relevant agents
      selectedAgents = phaseAgents;
    }

    return selectedAgents.map(agent => ({
      ...agent,
      contextScore: calculateContextScore(agent, phase, complexity, userRole)
    })).sort((a, b) => b.contextScore - a.contextScore);
  };

  // Helper function to calculate context relevance score
  const calculateContextScore = (agent: BMadAgent, phase: string, complexity: string, userRole: string): number => {
    let score = 0;

    // Phase relevance (high weight)
    if (agent.phase.includes(phase)) score += 50;

    // Agent specialization alignment
    switch (phase) {
      case 'analysis':
        if (['analyst', 'ux-designer'].includes(agent.id)) score += 30;
        break;
      case 'planning':
        if (['pm', 'sm'].includes(agent.id)) score += 30;
        break;
      case 'solutioning':
        if (['architect', 'tech-writer'].includes(agent.id)) score += 30;
        break;
      case 'implementation':
        if (['dev', 'tea'].includes(agent.id)) score += 30;
        break;
    }

    // Complexity adjustment
    if (complexity === 'high' && ['architect', 'tea'].includes(agent.id)) score += 20;
    if (complexity === 'low' && ['pm', 'dev'].includes(agent.id)) score += 20;

    // User role alignment
    if (userRole === 'PROJECT_MANAGER' && agent.id === 'pm') score += 15;
    if (userRole === 'ADMIN' && ['architect', 'pm'].includes(agent.id)) score += 10;

    return score;
  };

  // Register framework service methods
  fastify.decorate('bmadFramework', {
    loadFramework: loadFrameworkData,
    getAgents: async () => (await getFrameworkData()).agents,
    getAgent: async (id: string) => {
      const data = await getFrameworkData();
      return data.agents.find(agent => agent.id === id);
    },
    getTemplates: async () => (await getFrameworkData()).templates,
    getTemplate: async (type: string) => {
      const data = await getFrameworkData();
      return data.templates.filter(template => template.type === type);
    },
    getWorkflows: async () => (await getFrameworkData()).workflows,
    getWorkflow: async (type: string) => {
      const data = await getFrameworkData();
      return data.workflows.find(workflow => workflow.type === type);
    },
    selectAgents: selectContextualAgents,
    getHealth: async () => {
      try {
        const data = await getFrameworkData();
        return {
          status: 'healthy',
          agents: data.agents.length,
          templates: data.templates.length,
          workflows: data.workflows.length,
          lastLoaded: lastLoadTime?.toISOString(),
          uptime: lastLoadTime ? Date.now() - lastLoadTime.getTime() : 0
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          error: (error as Error).message,
          lastLoaded: lastLoadTime?.toISOString()
        };
      }
    },
    reloadFramework: async () => {
      frameworkData = null;
      lastLoadTime = null;
      if (fastify.redis) {
        try {
          await fastify.redis.del(['bmad:framework:data', 'bmad:framework:loaded_at']);
        } catch (error) {
          fastify.logger.warn('Failed to clear Redis cache:', error);
        }
      }
      return await loadFrameworkData();
    }
  });

  // Initialize framework on startup
  try {
    await loadFrameworkData();
    fastify.logger.info('BMad v6 framework integration plugin loaded successfully');
  } catch (error) {
    fastify.logger.error('Failed to initialize BMad v6 framework:', error);
    // Don't throw here to allow graceful degradation
  }
};

// Type declarations
declare module 'fastify' {
  interface FastifyInstance {
    bmadFramework: {
      loadFramework(): Promise<BMadFrameworkData>;
      getAgents(): Promise<BMadAgent[]>;
      getAgent(id: string): Promise<BMadAgent | undefined>;
      getTemplates(): Promise<BMadTemplate[]>;
      getTemplate(type: string): Promise<BMadTemplate[]>;
      getWorkflows(): Promise<BMadWorkflow[]>;
      getWorkflow(type: string): Promise<BMadWorkflow | undefined>;
      selectAgents(phase: string, complexity: 'low' | 'medium' | 'high', userRole: string): Promise<BMadAgent[]>;
      getHealth(): Promise<any>;
      reloadFramework(): Promise<BMadFrameworkData>;
    };
  }
}

export default fp(bmadFrameworkPlugin, {
  name: 'bmad-framework',
  dependencies: ['redis']
});

export type { BMadAgent, BMadTemplate, BMadWorkflow, BMadFrameworkData };