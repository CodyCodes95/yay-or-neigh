import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import cloudinary from "../../../utils/cloudinary.mjs";

export const submissionRouter = createTRPCRouter({
  createSubmission: publicProcedure
    .input(
      z.object({
        formId: z.string(),
        email: z.string(),
        images: z.array(z.string()),
        fields: z.array(
          z.object({
            id: z.string(),
            value: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { formId, email, images, fields } = input;
      const submission = await ctx.prisma.submission.create({
        data: {
          formId,
          email,
          fields,
        },
      });
      const imagePromises = images.map(async (image) => {
        return await cloudinary.uploader.upload(image, {
          folder: "submissions",
        });
      });
      const uploadedImages = await Promise.all(imagePromises);
      ctx.prisma.image.createMany({
        data: uploadedImages.map((image) => {
          return {
            submissionId: submission.id,
            url: image.url,
          };
        }),
      });
      return submission;
    }),
});
