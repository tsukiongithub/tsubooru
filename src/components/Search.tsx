import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import {
	type FC,
	type FormEvent,
	type KeyboardEvent,
	useState,
	type MouseEvent,
	useEffect,
	type ChangeEvent,
} from "react";

import shortenNumber from "@/common/shortenNumber";

const Search: FC = () => {
	const router = useRouter();
	const { tags } = router.query;

	const [suggestions, setSuggestions] = useState<{ count: number; name: string; type: number }[]>([]);
	const [suggestionsActive, setSuggestionsActive] = useState<boolean>(false);

	const [suggestionIndex, setSuggestionIndex] = useState<number>(-1);
	const [suggestionValue, setSuggestionValue] = useState<string>("");
	const [queryValue, setQueryValue] = useState<string>("");

	const {
		data: tagsData,
		isSuccess: tagsDataIsSuccess,
		refetch: refetchTagsData,
	} = trpc.gelbooru.getTags.useQuery({ search: queryValue });

	useEffect(() => {
		document.addEventListener("keydown", (ev) => {
			const inputEl = document.querySelector("#searchInput") as HTMLInputElement;
			if (ev.key === "/" && !(document.activeElement === inputEl)) {
				ev.preventDefault();
				inputEl.focus();
			}
		});
	}, []);

	useEffect(() => {
		if (tagsDataIsSuccess && tagsData && tagsData.tags) {
			setSuggestions(
				tagsData.tags.map((tag) => {
					return { count: tag.count, name: tag.name, type: tag.type };
				})
			);
		}
		if (queryValue.length >= 1) {
			setSuggestionsActive(true);
		} else {
			setSuggestionsActive(false);
		}
	}, [tagsDataIsSuccess, tagsData, queryValue, queryValue.length]);

	useEffect(() => {
		if (tags !== undefined) {
			if (tags.length > 0) {
				const searchedTags = tags as string;
				setSuggestionValue(`${searchedTags.replaceAll("+", " ")} `);
			}
		}
	}, [tags]);

	// add tag in input or search if same input is empty
	const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		// if no suggestion is picked just search for whatever is in the search field and put a " " (SPACE) at the end
		if (suggestionIndex === -1) {
			suggestionValue.lastIndexOf(" ") === suggestionValue.length - 1
				? setSuggestionValue(`${suggestionValue}`)
				: setSuggestionValue(`${suggestionValue} `);
			setQueryValue("");

			router.query.tags = suggestionValue.trim().replaceAll(" ", "+");
			router.push(router);
		} else {
			if (suggestions[suggestionIndex] !== undefined) {
				setSuggestionIndex(-1);
				setSuggestionValue(
					`${suggestionValue.substring(0, suggestionValue.lastIndexOf(" ") + 1).toLowerCase()}${
						suggestions[suggestionIndex]!.name
					} `
				);
				setQueryValue("");
			} else if (queryValue.trim() !== "") {
				setSuggestionIndex(-1);
				setSuggestionValue(`${suggestionValue} `);
				setQueryValue("");
			}
		}
	};

	const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const rawQuery = ev.currentTarget.value;

		// set query to the last word in the input field
		const query = rawQuery.substring(rawQuery.lastIndexOf(" ") + 1).toLowerCase();

		setSuggestionValue(rawQuery);
		setQueryValue(query);

		if (queryValue.length > 1) {
			refetchTagsData();
			const filteredSuggestions = suggestions.filter(
				(suggestion) => suggestion.name.toLowerCase().indexOf(queryValue) > -1
			);
			if (filteredSuggestions !== undefined) {
				setSuggestions(filteredSuggestions);
			}
		}
	};

	const handleSuggestionClick = (ev: MouseEvent<HTMLElement>) => {
		const suggestionEl = ev.currentTarget.children[1] as HTMLDivElement;
		setSuggestionIndex(-1);
		setSuggestionValue(`${suggestionEl.innerText.replace(" ", "_")} `);
		setQueryValue("");
	};

	// navigate autocomplete dropdown
	const handleKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
		if (ev.key === "Escape") {
			ev.preventDefault();
			if (suggestionsActive) {
				setSuggestionIndex(-1);
				setSuggestionsActive(false);
			} else {
				ev.currentTarget.blur();
			}
		} else if (ev.key === "ArrowUp" && suggestionValue !== "") {
			ev.preventDefault();
			if (suggestionsActive === false) {
				setSuggestionsActive(true);
			}
			if (suggestionIndex === 0) {
				return;
			}
			setSuggestionIndex(suggestionIndex - 1);
		} else if (ev.key === "ArrowDown" && suggestionValue !== "") {
			ev.preventDefault();
			if (suggestionsActive === false) {
				setSuggestionsActive(true);
			}
			if (suggestionIndex === suggestions.length - 1) {
				return;
			}
			setSuggestionIndex(suggestionIndex + 1);
		}
	};

	return (
		<>
			<form
				onSubmit={handleSubmit}
				autoComplete={"false"}
			>
				<div>
					<div className="flex flex-col items-center gap-4 sm:flex-row">
						<div className="relative w-full">
							<input
								className="w-full rounded-md border-2 border-gray-200 bg-gray-100 px-1 py-2 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-black sm:h-full"
								type="text"
								id="searchInput"
								value={suggestionValue}
								onChange={handleChange}
								onKeyDown={handleKeyDown}
							/>
							{suggestionsActive ? (
								<>
									<ul className="absolute inset-x-0 top-full z-10 mt-1 rounded-b-md">
										{suggestions.map((suggestion, key) => {
											return (
												<li
													className={`${
														key === suggestionIndex ? "bg-red-400" : "bg-gray-300"
													} flex cursor-pointer py-2 px-4 first:rounded-t-md last:rounded-b-md hover:bg-red-500`}
													onClick={handleSuggestionClick}
													key={key}
												>
													<div className="mr-3 w-[4ch]">
														{shortenNumber(suggestion.count)}
													</div>
													<div>{suggestion.name.replaceAll("_", " ")}</div>
													<div className="ml-auto">
														{suggestion.type === 0
															? "tag"
															: suggestion.type === 1
															? "artist"
															: suggestion.type === 3
															? "copyright"
															: suggestion.type === 4
															? "character"
															: suggestion.type === 5
															? "metadata"
															: suggestion.type === 6
															? "deprecated"
															: null}
													</div>
												</li>
											);
										})}
									</ul>
								</>
							) : (
								<></>
							)}
						</div>
						<button
							className="btn-neutral"
							type="submit"
						>
							search
						</button>
					</div>
				</div>
			</form>
		</>
	);
};

export default Search;
