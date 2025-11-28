// BMad Framework Integration Test
// Tests the core framework loading without database dependency

import path from 'path';
import { promises as fs } from 'fs';
import yaml from 'js-yaml';

interface BMadAgent {
  id: string;
  name: string;
  description: string;
  phases: string[];
  capabilities: string[];
  contextRequirements: string[];
}

interface BMadWorkflow {
  id: string;
  name: string;
  type: string;
  phases: string[];
  metadata: {
    description: string;
    complexity: string;
    duration: string;
    agentCount: string;
  };
}

class BMadFrameworkTest {
  private bmadRoot: string;
  private agents: Map<string, BMadAgent> = new Map();
  private workflows: Map<string, BMadWorkflow> = new Map();

  constructor() {
    // Get project root from current directory (backend/src)
    const currentDir = process.cwd();
    const projectRoot = path.resolve(currentDir, '../..');
    this.bmadRoot = path.join(projectRoot, 'bmm');

    console.log('🧠 BMad Framework Test Initializing...');
    console.log(`📁 Project Root: ${projectRoot}`);
    console.log(`🎯 BMad Root: ${this.bmadRoot}`);
  }

  private async loadAgentDefinitions(): Promise<void> {
    try {
      const agentsDir = path.join(this.bmadRoot, 'agents');
      console.log(`📂 Loading agents from: ${agentsDir}`);

      // Check if directory exists
      const dirExists = await fs.access(agentsDir).then(() => true).catch(() => false);
      if (!dirExists) {
        throw new Error(`Agents directory not found: ${agentsDir}`);
      }

      const files = await fs.readdir(agentsDir);
      const agentFiles = files.filter(f => f.endsWith('.md'));

      console.log(`📄 Found ${agentFiles.length} agent files: ${agentFiles.join(', ')}`);

      for (const file of agentFiles) {
        const filePath = path.join(agentsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');

        // Parse frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
          console.log(`⚠️  No frontmatter found in ${file}, skipping`);
          continue;
        }

        try {
          const frontmatter = yaml.load(frontmatterMatch[1]) as any;

          // Extract agent XML if present
          const xmlMatch = content.match(/<agent[^>]*>([\s\S]*?)<\/agent>/);
          let agentName = frontmatter.name || path.basename(file, '.md');

          if (xmlMatch) {
            // Try to extract name from XML
            const nameMatch = xmlMatch[0].match(/name="([^"]+)"/);
            if (nameMatch) {
              agentName = nameMatch[1];
            }
          }

          const agent: BMadAgent = {
            id: path.basename(file, '.md'),
            name: agentName,
            description: frontmatter.description || `${agentName} Agent`,
            phases: this.extractPhases(content),
            capabilities: this.extractCapabilities(content),
            contextRequirements: this.extractContextRequirements(content)
          };

          this.agents.set(agent.id, agent);
          console.log(`✅ Loaded agent: ${agent.id} (${agent.name})`);

        } catch (parseError) {
          console.error(`❌ Failed to parse ${file}:`, parseError);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load agent definitions:', error);
      throw error;
    }
  }

  private extractPhases(content: string): string[] {
    // Look for phase mentions in the content
    const phases = ['analysis', 'planning', 'solutioning', 'implementation'];
    return phases.filter(phase =>
      content.toLowerCase().includes(phase.toLowerCase())
    );
  }

  private extractCapabilities(content: string): string[] {
    const capabilities: string[] = [];

    // Look for common capability indicators
    if (content.includes('development') || content.includes('coding') || content.includes('implement')) {
      capabilities.push('Development');
    }
    if (content.includes('analysis') || content.includes('analyze')) {
      capabilities.push('Analysis');
    }
    if (content.includes('design') || content.includes('architecture')) {
      capabilities.push('Design');
    }
    if (content.includes('testing') || content.includes('quality')) {
      capabilities.push('Testing');
    }
    if (content.includes('project') || content.includes('management')) {
      capabilities.push('Project Management');
    }

    return capabilities;
  }

  private extractContextRequirements(content: string): string[] {
    const requirements: string[] = [];

    // Look for context requirement patterns
    if (content.includes('story') || content.includes('requirement')) {
      requirements.push('Requirements');
    }
    if (content.includes('technical') || content.includes('architecture')) {
      requirements.push('Technical Specifications');
    }
    if (content.includes('user') || content.includes('persona')) {
      requirements.push('User Context');
    }

    return requirements;
  }

  private initializeDefaultWorkflows(): void {
    // Define the three main BMad workflows
    const workflows: BMadWorkflow[] = [
      {
        id: 'quick_flow',
        name: 'Quick Flow',
        type: 'quick_flow',
        phases: ['analysis', 'implementation'],
        metadata: {
          description: 'Rapid development track for simple features and quick iterations',
          complexity: 'low',
          duration: '1-2 weeks',
          agentCount: '2-4'
        }
      },
      {
        id: 'bmad_method',
        name: 'BMad Method',
        type: 'bmad_method',
        phases: ['analysis', 'planning', 'solutioning', 'implementation'],
        metadata: {
          description: 'Full BMad v6 methodology for complex projects and enterprise solutions',
          complexity: 'medium',
          duration: '4-8 weeks',
          agentCount: '6-12'
        }
      },
      {
        id: 'brownfield',
        name: 'Brownfield',
        type: 'brownfield',
        phases: ['analysis', 'planning', 'solutioning', 'implementation'],
        metadata: {
          description: 'Legacy system modernization with careful analysis and migration planning',
          complexity: 'high',
          duration: '8-16 weeks',
          agentCount: '8-15'
        }
      }
    ];

    workflows.forEach(workflow => {
      this.workflows.set(workflow.id, workflow);
    });

    console.log(`✅ Initialized ${workflows.length} default workflows`);
  }

  public async testFrameworkIntegration(): Promise<void> {
    console.log('\n🚀 Starting BMad Framework Integration Test\n');

    try {
      // Step 1: Load agent definitions
      console.log('📋 Step 1: Loading Agent Definitions');
      await this.loadAgentDefinitions();
      console.log(`✅ Loaded ${this.agents.size} agents\n`);

      // Step 2: Initialize workflows
      console.log('📋 Step 2: Initializing Workflows');
      this.initializeDefaultWorkflows();
      console.log(`✅ Loaded ${this.workflows.size} workflows\n`);

      // Step 3: Test contextual agent selection
      console.log('📋 Step 3: Testing Contextual Agent Selection');
      this.testContextualSelection();

      // Step 4: Display summary
      console.log('\n📊 Framework Integration Summary');
      console.log('═══════════════════════════════════════');

      console.log('\n🤖 Available Agents:');
      Array.from(this.agents.values()).forEach(agent => {
        console.log(`  • ${agent.name} (${agent.id})`);
        console.log(`    Phases: ${agent.phases.join(', ') || 'All phases'}`);
        console.log(`    Capabilities: ${agent.capabilities.join(', ') || 'General'}`);
      });

      console.log('\n🔄 Available Workflows:');
      Array.from(this.workflows.values()).forEach(workflow => {
        console.log(`  • ${workflow.name} (${workflow.type})`);
        console.log(`    Phases: ${workflow.phases.join(' → ')}`);
        console.log(`    Complexity: ${workflow.metadata.complexity}, Duration: ${workflow.metadata.duration}`);
      });

      console.log('\n✅ BMad Framework Integration Test PASSED');
      console.log('🎉 Framework is ready for web platform integration!');

    } catch (error) {
      console.error('\n❌ BMad Framework Integration Test FAILED');
      console.error('Error:', error);
      process.exit(1);
    }
  }

  private testContextualSelection(): void {
    const testContext = {
      phase: 'implementation',
      complexity: 'medium',
      projectType: 'web-application'
    };

    console.log(`🎯 Testing context: ${JSON.stringify(testContext)}`);

    const recommendedAgents = this.selectContextualAgents(testContext);
    console.log(`✅ Recommended ${recommendedAgents.length} agents for context:`);

    recommendedAgents.forEach(agent => {
      console.log(`  • ${agent.name} - Phases: [${agent.phases.join(', ')}]`);
    });
  }

  private selectContextualAgents(context: { phase: string; complexity: string; projectType: string }): BMadAgent[] {
    const agents = Array.from(this.agents.values());

    return agents
      .filter(agent =>
        agent.phases.length === 0 || // Agent works in all phases
        agent.phases.includes(context.phase) // Agent works in current phase
      )
      .slice(0, 5); // Return top 5 recommendations
  }
}

// Run the test
async function runTest() {
  const tester = new BMadFrameworkTest();
  await tester.testFrameworkIntegration();
}

if (require.main === module) {
  runTest().catch(console.error);
}

export default BMadFrameworkTest;