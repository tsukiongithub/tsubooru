import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type {
	FC,
	FormEvent,
	KeyboardEvent,
	MouseEvent,
	ChangeEvent,
} from "react";

const Search: FC = () => {
	const router = useRouter();
	const { s } = router.query;

	const [suggestions, setSuggestions] = useState<string[]>([]);
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
		if (tagsDataIsSuccess && tagsData && tagsData.tags) {
			setSuggestions(tagsData.tags.map((tag) => tag.name));
		}
		if (queryValue.length >= 1) {
			setSuggestionsActive(true);
		} else {
			setSuggestionsActive(false);
		}
	}, [tagsDataIsSuccess, tagsData, queryValue, queryValue.length]);

	useEffect(() => {
		if (s !== undefined) {
			if (s.length > 0) {
				setSuggestionValue(`${s as string} `);
			}
		}
	}, [s]);

	useEffect(() => {
		document.addEventListener("keydown", (ev) => {
			if (ev.key === "/") {
				ev.preventDefault();
				const input = document.querySelector(
					"#searchInput"
				) as HTMLInputElement;
				input.focus();
			}
		});
	}, []);

	// add tag in input or search if same input is empty
	const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		// if no suggestion is picked just search for whatever is in the search field and put a " " (SPACE) at the end
		if (suggestionIndex === -1) {
			suggestionValue.lastIndexOf(" ") === suggestionValue.length - 1
				? setSuggestionValue(`${suggestionValue}`)
				: setSuggestionValue(`${suggestionValue} `);
			setQueryValue("");
			router.query.s = suggestionValue.trim().replaceAll(" ", "+");
			router.push(router);
		} else {
			if (suggestions[suggestionIndex] !== undefined) {
				setSuggestionIndex(-1);
				setSuggestionValue(
					`${suggestionValue
						.substring(0, suggestionValue.lastIndexOf(" ") + 1)
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						.toLowerCase()}${suggestions[suggestionIndex]!} `
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
		const query = rawQuery
			.substring(rawQuery.lastIndexOf(" ") + 1)
			.toLowerCase();

		setSuggestionValue(rawQuery);
		setQueryValue(query);

		if (queryValue.length > 1) {
			refetchTagsData();
			const filteredSuggestions = suggestions.filter(
				(suggestion) =>
					suggestion.toLowerCase().indexOf(queryValue) > -1
			);
			if (filteredSuggestions !== undefined) {
				setSuggestions(filteredSuggestions);
			}
		}
	};

	const handleSuggestionClick = (ev: MouseEvent<HTMLLIElement>) => {
		setSuggestionIndex(-1);
		setSuggestionValue(`${ev.currentTarget.innerText} `);
		setQueryValue("");
	};

	// navigate autocomplete dropdown
	const handleKeyDown = (ev: KeyboardEvent) => {
		if (ev.key === "Escape") {
			ev.preventDefault();
			if (suggestionsActive) {
				setSuggestionIndex(-1);
				setSuggestionsActive(false);
			} else {
				const input = ev.currentTarget as HTMLInputElement;
				input.blur();
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
		<div>
			<form
				onSubmit={handleSubmit}
				autoComplete={"false"}
			>
				<div>
					<div className="flex gap-4">
						<div className="relative flex-grow">
							<div>
								<input
									className="h-full w-full rounded-md border-2 border-gray-200 bg-gray-100 p-1 text-lg"
									id="searchInput"
									type="text"
									value={suggestionValue}
									onChange={handleChange}
									onKeyDown={handleKeyDown}
								/>
							</div>
							{suggestionsActive ? (
								<ul className="absolute inset-x-0 top-full z-10 mt-1 rounded-b-md">
									{suggestions.map((suggestion, key) => {
										return (
											<li
												key={key}
												onClick={handleSuggestionClick}
												className={`${
													key === suggestionIndex
														? "bg-red-400"
														: "bg-gray-300"
												} py-2 px-1 first:rounded-t-md last:rounded-b-md`}
											>
												{suggestion.replaceAll(
													"_",
													" "
												)}
											</li>
										);
									})}
								</ul>
							) : (
								<></>
							)}
						</div>
						<button
							className="btn-neutral"
							type="submit"
						>
							search gelbooru
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Search;
