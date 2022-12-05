import { router } from "../trpc";
import { exampleRouter } from "./example";
import { gelRouter } from "./gelbooru";

export const appRouter = router({
	example: exampleRouter,
	gelbooru: gelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
