import { FastifyPluginAsync } from 'fastify';
import type { BMadAgent, BMadTemplate, BMadWorkflow } from '../plugins/bmadFramework';

const bmadRoutes: FastifyPluginAsync = async (fastify) => {

  // Get all available agents
  fastify.get('/agents', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get all BMad v6 agents',
      tags: ['BMad Framework'],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            agents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  role: { type: 'string' },
                  capabilities: { type: 'array', items: { type: 'string' } },
                  phase: { type: 'array', items: { type: 'string' } },
                  description: { type: 'string' },
                  contextRequirements: { type: 'array', items: { type: 'string' } },
                  metadata: { type: 'object' }
                }
              }
            },
            count: { type: 'number' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const agents = await fastify.bmadFramework.getAgents();

      // Log telemetry
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'bmad_agents_accessed',
          userId: request.user!.id,
          data: {
            agentCount: agents.length,
            userRole: request.user!.role
          }
        }
      });

      return {
        agents,
        count: agents.length
      };
    } catch (error) {
      fastify.logger.error('Error fetching BMad agents:', error);
      return reply.code(500).send({
        code: 'BMAD_AGENTS_ERROR',
        message: 'Failed to fetch BMad v6 agents'
      });
    }
  });

  // Get specific agent by ID
  fastify.get('/agents/:id', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get specific BMad v6 agent',
      tags: ['BMad Framework'],
      security: [{ BearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const agent = await fastify.bmadFramework.getAgent(id);

      if (!agent) {
        return reply.code(404).send({
          code: 'AGENT_NOT_FOUND',
          message: `Agent '${id}' not found`
        });
      }

      // Log telemetry
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'bmad_agent_accessed',
          userId: request.user!.id,
          data: {
            agentId: id,
            agentName: agent.name
          }
        }
      });

      return agent;
    } catch (error) {
      fastify.logger.error('Error fetching BMad agent:', error);
      return reply.code(500).send({
        code: 'BMAD_AGENT_ERROR',
        message: 'Failed to fetch BMad v6 agent'
      });
    }
  });

  // Get contextual agent recommendations
  fastify.post('/agents/recommend', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get contextual agent recommendations',
      tags: ['BMad Framework'],
      security: [{ BearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          phase: {
            type: 'string',
            enum: ['analysis', 'planning', 'solutioning', 'implementation']
          },
          complexity: {
            type: 'string',
            enum: ['low', 'medium', 'high']
          }
        },
        required: ['phase', 'complexity']
      }
    }
  }, async (request, reply) => {
    try {
      const { phase, complexity } = request.body as {
        phase: string;
        complexity: 'low' | 'medium' | 'high'
      };

      const recommendations = await fastify.bmadFramework.selectAgents(
        phase,
        complexity,
        request.user!.role
      );

      // Log telemetry
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'bmad_agent_recommendations',
          userId: request.user!.id,
          data: {
            phase,
            complexity,
            recommendedCount: recommendations.length,
            recommendedAgents: recommendations.map(a => a.id)
          }
        }
      });

      return {
        recommendations,
        context: {
          phase,
          complexity,
          userRole: request.user!.role
        }
      };
    } catch (error) {
      fastify.logger.error('Error getting agent recommendations:', error);
      return reply.code(500).send({
        code: 'BMAD_RECOMMENDATIONS_ERROR',
        message: 'Failed to get agent recommendations'
      });
    }
  });

  // Get all available templates
  fastify.get('/templates', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get all BMad v6 templates',
      tags: ['BMad Framework'],
      security: [{ BearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          phase: { type: 'string' },
          track: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const query = request.query as { phase?: string; track?: string };
      let templates = await fastify.bmadFramework.getTemplates();

      // Filter by phase if specified
      if (query.phase) {
        templates = templates.filter(t => t.phase === query.phase);
      }

      // Filter by track if specified
      if (query.track) {
        templates = templates.filter(t => t.track.includes(query.track!));
      }

      // Log telemetry
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'bmad_templates_accessed',
          userId: request.user!.id,
          data: {
            templateCount: templates.length,
            filters: query
          }
        }
      });

      return {
        templates,
        count: templates.length,
        filters: query
      };
    } catch (error) {
      fastify.logger.error('Error fetching BMad templates:', error);
      return reply.code(500).send({
        code: 'BMAD_TEMPLATES_ERROR',
        message: 'Failed to fetch BMad v6 templates'
      });
    }
  });

  // Get templates by type
  fastify.get('/templates/:type', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get BMad v6 templates by type',
      tags: ['BMad Framework'],
      security: [{ BearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          type: { type: 'string' }
        },
        required: ['type']
      }
    }
  }, async (request, reply) => {
    try {
      const { type } = request.params as { type: string };
      const templates = await fastify.bmadFramework.getTemplate(type.toUpperCase());

      // Log telemetry
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'bmad_template_type_accessed',
          userId: request.user!.id,
          data: {
            templateType: type,
            templateCount: templates.length
          }
        }
      });

      return {
        templates,
        type: type.toUpperCase(),
        count: templates.length
      };
    } catch (error) {
      fastify.logger.error('Error fetching BMad templates by type:', error);
      return reply.code(500).send({
        code: 'BMAD_TEMPLATE_TYPE_ERROR',
        message: 'Failed to fetch BMad v6 templates by type'
      });
    }
  });

  // Get all workflow definitions
  fastify.get('/workflows', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get all BMad v6 workflow definitions',
      tags: ['BMad Framework'],
      security: [{ BearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const workflows = await fastify.bmadFramework.getWorkflows();

      // Log telemetry
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'bmad_workflows_accessed',
          userId: request.user!.id,
          data: {
            workflowCount: workflows.length
          }
        }
      });

      return {
        workflows,
        count: workflows.length
      };
    } catch (error) {
      fastify.logger.error('Error fetching BMad workflows:', error);
      return reply.code(500).send({
        code: 'BMAD_WORKFLOWS_ERROR',
        message: 'Failed to fetch BMad v6 workflows'
      });
    }
  });

  // Get specific workflow by type
  fastify.get('/workflows/:type', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get specific BMad v6 workflow',
      tags: ['BMad Framework'],
      security: [{ BearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['quick_flow', 'bmad_method', 'brownfield']
          }
        },
        required: ['type']
      }
    }
  }, async (request, reply) => {
    try {
      const { type } = request.params as { type: string };
      const workflow = await fastify.bmadFramework.getWorkflow(type as any);

      if (!workflow) {
        return reply.code(404).send({
          code: 'WORKFLOW_NOT_FOUND',
          message: `Workflow '${type}' not found`
        });
      }

      // Log telemetry
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'bmad_workflow_accessed',
          userId: request.user!.id,
          data: {
            workflowType: type,
            workflowName: workflow.name
          }
        }
      });

      return workflow;
    } catch (error) {
      fastify.logger.error('Error fetching BMad workflow:', error);
      return reply.code(500).send({
        code: 'BMAD_WORKFLOW_ERROR',
        message: 'Failed to fetch BMad v6 workflow'
      });
    }
  });

  // Start a workflow instance
  fastify.post('/workflows/:type/start', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Start a BMad v6 workflow instance',
      tags: ['BMad Framework'],
      security: [{ BearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['quick_flow', 'bmad_method', 'brownfield']
          }
        },
        required: ['type']
      },
      body: {
        type: 'object',
        properties: {
          projectId: { type: 'string' },
          projectName: { type: 'string' },
          context: { type: 'object' }
        },
        required: ['projectName']
      }
    }
  }, async (request, reply) => {
    try {
      const { type } = request.params as { type: string };
      const { projectId, projectName, context } = request.body as {
        projectId?: string;
        projectName: string;
        context?: any;
      };

      const workflow = await fastify.bmadFramework.getWorkflow(type as any);
      if (!workflow) {
        return reply.code(404).send({
          code: 'WORKFLOW_NOT_FOUND',
          message: `Workflow '${type}' not found`
        });
      }

      // Create workflow instance in database
      const workflowInstance = await fastify.prisma.bMadWorkflowInstance.create({
        data: {
          userId: request.user!.id,
          projectId: projectId || null,
          workflowType: type,
          currentPhase: workflow.phases[0],
          phaseProgress: {},
          workflowState: {
            projectName,
            context: context || {},
            startedAt: new Date().toISOString()
          },
          activeAgents: []
        }
      });

      // Log telemetry
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'bmad_workflow_started',
          userId: request.user!.id,
          data: {
            workflowType: type,
            workflowInstanceId: workflowInstance.id,
            projectName
          }
        }
      });

      return {
        workflowInstance: {
          id: workflowInstance.id,
          type: workflowInstance.workflowType,
          currentPhase: workflowInstance.currentPhase,
          projectName,
          createdAt: workflowInstance.createdAt
        },
        workflow,
        nextSteps: {
          phase: workflow.phases[0],
          recommendedAgents: await fastify.bmadFramework.selectAgents(
            workflow.phases[0],
            'medium',
            request.user!.role
          )
        }
      };
    } catch (error) {
      fastify.logger.error('Error starting BMad workflow:', error);
      return reply.code(500).send({
        code: 'BMAD_WORKFLOW_START_ERROR',
        message: 'Failed to start BMad v6 workflow'
      });
    }
  });

  // Transition workflow phase (AC7)
  fastify.put('/workflows/:instanceId/transition', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Transition BMad v6 workflow to next phase',
      tags: ['BMad Framework'],
      security: [{ BearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          instanceId: { type: 'string', description: 'Workflow instance ID' }
        },
        required: ['instanceId']
      },
      body: {
        type: 'object',
        properties: {
          nextPhase: {
            type: 'string',
            enum: ['analysis', 'planning', 'solutioning', 'implementation']
          },
          completionCriteria: {
            type: 'array',
            items: { type: 'string' },
            description: 'Completed criteria for current phase'
          },
          notes: { type: 'string', description: 'Transition notes' }
        },
        required: ['nextPhase']
      }
    }
  }, async (request, reply) => {
    try {
      const { instanceId } = request.params as any;
      const { nextPhase, completionCriteria = [], notes } = request.body as any;

      // Get existing workflow instance
      const instance = await fastify.prisma.bMadWorkflowInstance.findUnique({
        where: { id: instanceId }
      });

      if (!instance) {
        return reply.code(404).send({
          code: 'WORKFLOW_INSTANCE_NOT_FOUND',
          message: `Workflow instance '${instanceId}' not found`
        });
      }

      // Validate user ownership
      if (instance.userId !== request.user!.id) {
        return reply.code(403).send({
          code: 'WORKFLOW_ACCESS_DENIED',
          message: 'Access denied to workflow instance'
        });
      }

      // Get workflow definition to validate transition
      const workflow = await fastify.bmadFramework.getWorkflow(instance.workflowType as any);
      if (!workflow) {
        return reply.code(400).send({
          code: 'WORKFLOW_DEFINITION_ERROR',
          message: 'Workflow definition not found'
        });
      }

      // Validate phase transition
      const allowedTransitions = workflow.phaseTransitions[instance.currentPhase] || [];
      if (!allowedTransitions.includes(nextPhase)) {
        return reply.code(400).send({
          code: 'INVALID_PHASE_TRANSITION',
          message: `Cannot transition from '${instance.currentPhase}' to '${nextPhase}'`
        });
      }

      // Get new agents for the next phase
      const nextPhaseAgents = await fastify.bmadFramework.selectAgents(
        nextPhase,
        'medium',
        request.user?.role || 'user'
      );

      // Update workflow instance
      const updatedInstance = await fastify.prisma.bMadWorkflowInstance.update({
        where: { id: instanceId },
        data: {
          currentPhase: nextPhase,
          phaseProgress: {
            ...instance.phaseProgress as any,
            [instance.currentPhase]: {
              completedAt: new Date().toISOString(),
              completionCriteria,
              notes
            }
          },
          activeAgents: nextPhaseAgents.slice(0, 3).map(agent => agent.id),
          updatedAt: new Date()
        }
      });

      // Log phase transition
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'bmad_workflow_phase_transition',
          userId: request.user!.id,
          data: {
            workflowInstanceId: instanceId,
            fromPhase: instance.currentPhase,
            toPhase: nextPhase,
            completionCriteria,
            newAgents: updatedInstance.activeAgents
          }
        }
      });

      fastify.logger.info(`Workflow ${instanceId} transitioned from ${instance.currentPhase} to ${nextPhase}`);

      return {
        workflowInstanceId: instanceId,
        previousPhase: instance.currentPhase,
        currentPhase: nextPhase,
        activeAgents: updatedInstance.activeAgents,
        transitionedAt: updatedInstance.updatedAt.toISOString()
      };
    } catch (error) {
      fastify.logger.error('Failed to transition workflow phase:', error);
      return reply.code(500).send({
        code: 'WORKFLOW_TRANSITION_ERROR',
        message: 'Failed to transition workflow phase'
      });
    }
  });

  // Get framework health status
  fastify.get('/health', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get BMad v6 framework health status',
      tags: ['BMad Framework'],
      security: [{ BearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const health = await fastify.bmadFramework.getHealth();
      return health;
    } catch (error) {
      fastify.logger.error('Error checking BMad framework health:', error);
      return reply.code(500).send({
        code: 'BMAD_HEALTH_ERROR',
        message: 'Failed to check BMad v6 framework health'
      });
    }
  });

  // Reload framework components
  fastify.post('/reload', {
    preHandler: [fastify.authenticate, fastify.requireRole(['ADMIN'])],
    schema: {
      description: 'Reload BMad v6 framework components',
      tags: ['BMad Framework'],
      security: [{ BearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const reloadedData = await fastify.bmadFramework.reloadFramework();

      // Log telemetry
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'bmad_framework_reloaded',
          userId: request.user!.id,
          data: {
            agents: reloadedData.agents.length,
            templates: reloadedData.templates.length,
            workflows: reloadedData.workflows.length
          }
        }
      });

      return {
        success: true,
        message: 'BMad v6 framework reloaded successfully',
        data: {
          agents: reloadedData.agents.length,
          templates: reloadedData.templates.length,
          workflows: reloadedData.workflows.length,
          reloadedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      fastify.logger.error('Error reloading BMad framework:', error);
      return reply.code(500).send({
        code: 'BMAD_RELOAD_ERROR',
        message: 'Failed to reload BMad v6 framework'
      });
    }
  });

  fastify.log.info('BMad v6 framework routes loaded');
};

export default bmadRoutes;