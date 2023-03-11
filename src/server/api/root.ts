import { createTRPCRouter } from "~/server/api/trpc";
import { fieldRouter } from "./routers/field";
import { formRouter } from "./routers/form";
import { imageRouter } from "./routers/image";
import { submissionRouter } from "./routers/submission";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // example: exampleRouter,
  form: formRouter,
  image: imageRouter,
  submission: submissionRouter,
  fields: fieldRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
