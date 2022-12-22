import Navigation from "@/components/Navigation";
import Search from "@/components/Search";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

import toNumber from "@/common/toNumber";

const Home: NextPage = () => {
	const router = useRouter();
	const { s, pid } = router.query;

	const [pageId, setPageId] = useState<number>(0);
	const [search, setSearch] = useState<string>();
	const [safeMode, setSafeMode] = useState<boolean>(true);

	const [posts, setPosts] = useState<GelPost[]>([]);

	const { data: postsData, isSuccess: postsDataIsSuccess } =
		trpc.gelbooru.getPosts.useQuery(
			{ search: search, pid: pageId, safeMode: safeMode },
			{ refetchOnWindowFocus: false }
		);

	useEffect(() => {
		if (postsDataIsSuccess) {
			if (postsData && postsData.posts) {
				setPosts(postsData.posts.map((post) => post));
			} else {
				setPosts([]);
			}
		}
	}, [postsData, postsDataIsSuccess]);

	useEffect(() => {
		// set search to defualt ...
		setSearch("");

		// ... and only set it to an actual value if it exists in the query params
		if (s !== undefined) {
			if (s.length > 0) {
				setSearch(s as string);
			}
		}
	}, [s]);

	useEffect(() => {
		if (pid !== undefined) {
			setPageId(toNumber(pid as string));
		} else {
			router.query.pid = "0";
			router.push(router);
			setPageId(0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pid]);

	const handlePagination = (direction: string) => {
		if (direction === "next") {
			router.query.pid = `${toNumber(pid as string) + 48}`;
			router.push(router);
		} else if (direction === "previous" && pageId !== 0) {
			router.query.pid = `${toNumber(pid as string) - 48}`;
			router.push(router);
		}
	};

	return (
		<>
			<Head>
				<title>tsubooru</title>
				<meta
					name="description"
					content="gelbooru proxy with additional features"
				/>
				<link
					rel="icon"
					href="/favicon.ico"
				/>
			</Head>
			<header className="w-full pb-4">
				<Navigation />
				<Search />
				{safeMode ? "safe mode is enabled" : "safe mode is not enabled"}
				<input
					checked={safeMode}
					onChange={() => setSafeMode(!safeMode)}
					type="checkbox"
				/>
			</header>
			<main>
				<div className="w-full">
					{postsDataIsSuccess && (
						<div className="grid-flow-rows grid w-full gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
							{posts.length >= 1 ? (
								posts.map((post, key) => {
									return (
										<article
											key={key}
											className="relative flex w-full flex-col"
										>
											<Link
												className="flex h-48 items-center justify-center"
												href={post.file_url}
											>
												<Image
													className={`${
														post.file_url.includes(
															"video-cdn"
														)
															? "border-2 border-blue-500"
															: "border-red-500"
													} max-h-full max-w-full object-contain`}
													src={post.preview_url}
													alt={`${post.id}`}
													width={post.preview_width}
													height={post.preview_height}
												/>
											</Link>
										</article>
									);
								})
							) : (
								<p>nothing found :/</p>
							)}
						</div>
					)}
				</div>
				<div>
					<button
						className="btn-neutral"
						onClick={() => {
							handlePagination("previous");
						}}
					>
						previous
					</button>
					<button
						className="btn-neutral"
						onClick={() => {
							handlePagination("next");
						}}
					>
						next
					</button>
				</div>
			</main>
		</>
	);
};

export default Home;
