import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const fieldRouter = createTRPCRouter({
  createFields: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
        fields: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
            order: z.number(),
            required: z.boolean(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.field.createMany({
        data: input.fields.map((field) => ({
          ...field,
          formId: input.formId,
        })),
      });
    }),
  updateField: protectedProcedure
    .input(
      z.object({
        fieldId: z.string(),
        name: z.string(),
        type: z.string(),
        order: z.number(),
        required: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.field.update({
        where: {
          id: input.fieldId,
        },
        data: {
          name: input.name,
          type: input.type,
          order: input.order,
          required: input.required,
        },
      });
    }),
});
