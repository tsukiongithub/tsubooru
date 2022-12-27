import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import process from "process";

const gelKey = process.env.GEL_API_KEY;
const gelUID = process.env.GEL_USER_ID;

const tagsUrl = `https://gelbooru.com//index.php?page=dapi&s=tag&q=index&json=1`;
const tagOrderBy = "count";
const tagLimit = 12;

const postsUrl = `https://gelbooru.com//index.php?page=dapi&s=post&q=index&json=1`;
const postLimit = 48;

const permBlacklist = ["-loli", "-shota", "-child_on_child"];

export const gelRouter = router({
	getTags: publicProcedure.input(z.object({ search: z.string() })).query(async ({ input }) => {
		const { search } = input;

		const url = `${tagsUrl}&limit=${tagLimit}&name_pattern=${search}%&orderby=${tagOrderBy}&api_key=${gelKey}&user_id=${gelUID}`;

		console.log(url);

		return {
			tags: await fetch(url)
				.then((response) => response.json())
				.then((jsonBody) => jsonBody.tag)
				.then((result: GelTag[]) => result)
				.catch((error) => console.log("error", error)),
		};
	}),
	getPosts: publicProcedure
		.input(
			z.object({
				search: z.string(),
				limit: z.number().nullish(),
				pid: z.number(),
			})
		)
		.query(async ({ input }) => {
			const { search, pid } = input;

			const modifiedSearch = `${search}+${permBlacklist.join("+")}`;

			const url = `${postsUrl}&limit=${postLimit}&tags=${modifiedSearch}&pid=${pid}&api_key=${gelKey}&user_id=${gelUID}`;

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
	addTag: publicProcedure
		.input(z.object({ tagCount: z.number(), tagName: z.string(), tagType: z.string() }))
		.mutation(async ({ input }) => {
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
