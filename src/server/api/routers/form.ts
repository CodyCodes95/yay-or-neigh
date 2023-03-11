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
          fields: {
            orderBy: {
              order: "asc",
            }
          },
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
  getFields: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      })
  )
    .query(({ ctx, input }) => {
      return ctx.prisma.field.findMany({
        where: {
          formId: input.formId,
        },
      });
    }
  ),
});
