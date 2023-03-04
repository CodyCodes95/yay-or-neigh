import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

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
  getUnjudgedSubmissions: protectedProcedure.query(async ({ ctx }) => {
    const submissions = await ctx.prisma.submission.findMany({
      where: {
        form: {
          userId: ctx.session.user.id,
        },
        approved: null,
        deferred: false
      },
    });
    return submissions;
  }
});
