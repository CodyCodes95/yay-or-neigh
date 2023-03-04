import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import cloudinary from "../../../utils/cloudinary.mjs";

export const imageRouter = createTRPCRouter({
  uploadSubmissionImage: publicProcedure
    .input(
      z.object({
        image: z.string(),
        submissionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const uploadedImage = await cloudinary.uploader.upload(input.image, {
        folder: "submissions",
      });
      return ctx.prisma.image.create({
        data: {
          url: uploadedImage.url,
          submissionId: input.submissionId,
        },
      });
    }),
});
