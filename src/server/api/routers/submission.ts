import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const submissionRouter = createTRPCRouter({
  createSubmission: publicProcedure
    .input(
      z.object({
        formId: z.string(),
        email: z.string(),
        fields: z.array(
          z.object({
            fieldId: z.string(),
            value: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { formId, email, fields } = input;
      const submission = await ctx.prisma.submission.create({
        data: {
          formId,
          email,
          data: fields,
        },
      });
      return submission;
    }),
  getAllUnjudgedSubmissions: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const submissions = await ctx.prisma.submission.findMany({
        where: {
          form: {
            userId: ctx.session.user.id,
            id: input.formId,
          },
          approved: null,
          deferred: false,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return submissions;
    }),
  getUnjudgedSubmissions: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
        offset: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const submissions = await ctx.prisma.submission.findFirst({
        where: {
          form: {
            userId: ctx.session.user.id,
            id: input.formId,
          },
          approved: null,
          deferred: false,
        },
        include: {
          Image: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        skip: input.offset,
      });
      return submissions;
    }),
});
