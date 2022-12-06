import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import process from "process";

const gelKey = `&api_key=${process.env.GEL_API_KEY}`;
const gelUID = `&user_id=${process.env.GEL_U_ID}`;
const postLimit = 48;
const blacklist = "";

export const gelRouter = router({
	getTags: publicProcedure.input(z.object({ search: z.string() })).query(async ({ input }) => {
		const url = `https://gelbooru.com//index.php?page=dapi&s=tag&q=index&json=1&limit=10&name_pattern=${input.search}%${gelKey}${gelUID}`;

		return {
			tags: await fetch(url)
				.then((response) => response.json())
				.then((jsonBody) => jsonBody.tag)
				.then((result: GelTag[]) => result)
				.catch((error) => console.log("error", error)),
		};
	}),
	getPosts: publicProcedure.input(z.object({ search: z.union([z.array(z.string()), z.string()]).nullish(), limit: z.number().nullish(), blacklist: z.string().nullish() })).query(async ({ input }) => {
		const url = `https://gelbooru.com//index.php?page=dapi&s=post&q=index&json=1&limit=${input.limit || postLimit}&tags=${input.search}${input.blacklist || blacklist}${gelKey}${gelUID}`;

		return {
			posts: await fetch(url)
				.then((response) => response.json())
				.then((jsonBody) => jsonBody.post)
				.then((result: GelPost[]) => result)
				.catch((error) => console.log("error", error)),
		};
	}),
	getTagByName: publicProcedure.input(z.object({ tagId: z.number() })).query(async ({ input }) => {
		const getTagByNameInDB = await prisma.tag.findUnique({
			where: {
				id: input.tagId,
			},
		});
		return { getTagByNameInDB };
	}),
	addTag: publicProcedure.input(z.object({ tagCount: z.number(), tagName: z.string(), tagType: z.string() })).mutation(async ({ input }) => {
		const addTagInDB = await prisma.tag.create({
			data: {
				count: input.tagCount,
				name: input.tagName,
				type: input.tagType,
			},
		});
		return { addTagInDB };
	}),
	getAllBlacklistedTags: publicProcedure.query(async () => {
		const getAllBlacklistedTagsInDB = await prisma.blacklisted_Tag.findMany();
		return { getAllBlacklistedTagsInDB };
	}),
	blacklistTag: publicProcedure.input(z.object({ tagId: z.number() })).mutation(async ({ input }) => {
		const blacklistTagInDB = await prisma.blacklisted_Tag.create({
			data: {
				tag_id: input.tagId,
			},
		});
		return { blacklistTagInDB };
	}),
});
