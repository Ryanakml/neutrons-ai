import { PAGINATION } from "@/config/constants";
import { prisma } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import { NodeType } from "@prisma-generated/index";
import type { Edge, Node } from "@xyflow/react";
import { inngest } from "@/inngest/client";
import { sendWorkflowExectution } from "@/inngest/utils";

export const workflowsRouter = createTRPCRouter({
  // Inngest Backround Jobs Procedure
  execute: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const workflow = await prisma.workflow.findFirstOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      await inngest.send({
        name: "workflows/execute.workflow",
        data: {
          workflowId: input.id,
        },
      });

      await sendWorkflowExectution({
        workflowId: input.id,
      });

      return workflow;
    }),

  // New Workflow
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).optional() }).optional())
    .mutation(async ({ ctx, input }) => {
      const randomName = uniqueNamesGenerator({
        dictionaries: [animals],
        separator: "-",
      });
      return prisma.workflow.create({
        data: {
          name: input?.name ?? randomName,
          userId: ctx.auth.user.id,
          nodes: {
            create: {
              type: NodeType.INITIAL,
              position: {
                x: 0,
                y: 0,
              },
              name: NodeType.INITIAL,
            },
          },
        },
      });
    }),

  // Remove Workflow
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  // Update Workflows Editor State
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string(),
            position: z.object({
              x: z.number(),
              y: z.number(),
            }),
            data: z.record(z.string(), z.any()).optional(),
          })
        ),
        edges: z.array(
          z.object({
            id: z.string(),
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, nodes, edges } = input;

      // Validation
      await prisma.workflow.findFirstOrThrow({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
      });

      return await prisma.$transaction(async (tx) => {
        // delete connection first (corresponding to nodes)
        await tx.connection.deleteMany({
          where: { workflowId: id },
        });

        // delete nodes
        await tx.node.deleteMany({
          where: { workflowId: id },
        });

        // crete new nodes
        if (nodes.length > 0) {
          await tx.node.createMany({
            data: nodes.map((n) => ({
              id: n.id,
              workflowId: id,
              name: n.type,
              type: n.type as NodeType,
              position: n.position,
              data: n.data || {},
            })),
          });
        }

        // create connection
        if (edges.length > 0) {
          await tx.connection.createMany({
            data: edges.map((e) => ({
              id: e.id,
              workflowId: id,
              fromNodeId: e.source,
              toNodeId: e.target,
              fromOutput: e.sourceHandle || "main",
              toInput: e.targetHandle || "main",
            })),
          });
        }

        return { id, success: true };
      });
    }),

  // Update Workflows Name
  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.workflow.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  // Get Workflow
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        include: { nodes: true, connections: true },
      });
      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));
      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));
      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default("").optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input ?? {};

      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items,
        totalCount,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),
});
