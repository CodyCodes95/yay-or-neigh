import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const submissionRouter = createTRPCRouter({
  createSubmission: publicProcedure
    .input(
      z.object({
        formId: z.string(),
        email: z.string(),
        fields: z.array(
          z.object({
            id: z.string(),
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
});
