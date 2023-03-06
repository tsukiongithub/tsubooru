import { cache } from "react";
import "server-only";

export const preload = (id: string) => {
	void getGelbooruPost(id);
};

export const getGelbooruPost = cache(async (id: string) => {
	// ...
});
