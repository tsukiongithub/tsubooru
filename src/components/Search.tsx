import { trpc } from "@/utils/trpc";
import { type FC, type FormEvent, type KeyboardEvent, useState, type MouseEvent, useEffect, type ChangeEvent } from "react";

interface SearchProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getSearchOutput: any;
}

const Search: FC<SearchProps> = (props: SearchProps) => {
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [suggestionsActive, setSuggestionsActive] = useState<boolean>(false);

	const [suggestionIndex, setSuggestionIndex] = useState<number>(-1);
	const [suggestionValue, setSuggestionValue] = useState<string>("");
	const [queryValue, setQueryValue] = useState<string>("");

	const { data: tagsData, isSuccess: tagsDataIsSuccess, refetch: refetchTagsData } = trpc.gelbooru.getTags.useQuery({ search: queryValue });

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

	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [output, setOutput] = useState("");

	props.getSearchOutput(output);

	// add tag in input or search if same input is empty
	const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		setSuggestionsActive(false);

		if (suggestions !== undefined) {
			if (suggestions[suggestionIndex] !== undefined) {
				setSuggestionIndex(-1);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				setSuggestionValue(`${suggestionValue.substring(0, suggestionValue.lastIndexOf(" ") + 1).toLowerCase()}${suggestions[suggestionIndex]!} `);
				setQueryValue("");
			} else if (queryValue.trim() !== "") {
				setSuggestionIndex(-1);
				setSuggestionValue(`${suggestionValue} `);
				setQueryValue("");
			}
		}
		if (suggestionsActive === false) {
			setOutput(suggestionValue.replaceAll(" ", "+"));
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
			const filteredSuggestions = suggestions.filter((suggestion) => suggestion.toLowerCase().indexOf(queryValue) > -1);
			if (filteredSuggestions !== undefined) {
				setSuggestions(filteredSuggestions);
			}
		} else {
			setSuggestionIndex(-1);
		}
	};

	const handleSuggestionClick = (ev: MouseEvent<HTMLLIElement>) => {
		setSuggestionIndex(-1);
		setSuggestionValue(`${ev.currentTarget.innerText} `);
		setSuggestionsActive(false);
	};

	// navigate autocomplete dropdown
	const handleKeyDown = (ev: KeyboardEvent) => {
		if (ev.key === "Escape" && suggestionsActive) {
			ev.preventDefault();
			setSuggestionIndex(-1);
			setSuggestionsActive(false);
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
					<div className="flex gap-4">
						<div className="relative flex-grow">
							<input
								className="h-full w-full rounded-md border-2 border-gray-200 bg-gray-100 p-1 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
								type="text"
								value={suggestionValue}
								onChange={handleChange}
								onKeyDown={handleKeyDown}
							/>
							{suggestionsActive ? (
								<ul className="absolute inset-x-0 top-full z-10 mt-1 rounded-b-md">
									{suggestions.map((suggestion, key) => {
										return (
											<li
												key={key}
												onClick={handleSuggestionClick}
												className={`${key === suggestionIndex ? "bg-red-400" : "bg-gray-300"} py-2 px-1 first:rounded-t-md last:rounded-b-md`}
											>
												{suggestion}
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
		</>
	);
};

export default Search;
