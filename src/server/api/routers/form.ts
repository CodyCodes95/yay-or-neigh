import { z } from "zod";
import {
  createTRPCRouter,
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
        }
      });
    }),
});
