import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import cloudinary from "../../../utils/cloudinary.mjs"

export const submissionRouter = createTRPCRouter({
    createSubmission: publicProcedure
        .input(
            z.object({
                formId: z.string(),
                email: z.string(),
                images: z.array(z.string()),
                fields: z.array(

})