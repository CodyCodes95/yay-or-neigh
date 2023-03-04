import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const formRouter = createTRPCRouter({
  getForm: publicProcedure
    .input(
      z.object({
        formId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.form.findUnique({
        where: {
          id: input.formId,
        },
        include: {
          fields: true,
        },
      });
    }),
  getMyForms: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.form.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        submissions: true,
      }
    });
  }),
});
