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

	const { data: tagsData, isSuccess: tagsDataIsSuccess, refetch: refetchTagsData } = trpc.gelbooru.getTags.useQuery({ search: suggestionValue }, { refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false });

	useEffect(() => {
		if (tagsDataIsSuccess) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			setSuggestions(tagsData!.tags!.map((tag) => tag.name));
		}
	}, [suggestionIndex, tagsData, tagsDataIsSuccess]);

	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [output, setOutput] = useState("");

	props.getSearchOutput(output);

	const removeTag = (key: number) => {
		setSelectedTags((tag) => tag.filter((_, index) => index !== key));
	};

	// add tag in input or search if same input is empty
	const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		setSuggestionsActive(false);
		if (suggestions !== undefined) {
			if (suggestions[suggestionIndex] !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				setSelectedTags([...selectedTags, suggestions[suggestionIndex]!]);
				setSuggestionValue("");
				setSuggestionIndex(-1);
			} else if (suggestionValue.trim() !== "") {
				setSelectedTags([...selectedTags, suggestionValue]);
				setSuggestionValue("");
			} else if (suggestionsActive !== true) {
				setOutput(selectedTags.join("+"));
			}
		}
	};

	const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const query = ev.currentTarget.value.toLowerCase();

		setSuggestionValue(query);
		refetchTagsData();

		if (query.length > 1) {
			const filteredSuggestions = suggestions.filter((suggestion) => suggestion.toLowerCase().indexOf(query) > -1);
			if (filteredSuggestions !== undefined) {
				setSuggestions(filteredSuggestions);
				setSuggestionsActive(true);
			}
		} else {
			setSuggestionsActive(false);
			setSuggestionIndex(-1);
		}
	};

	const handleSuggestionClick = (ev: MouseEvent<HTMLLIElement>) => {
		setSuggestionValue("");
		setSuggestionIndex(-1);
		setSelectedTags([...selectedTags, ev.currentTarget.innerText]);
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
							{suggestionsActive && (
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
							)}
						</div>
						<button
							className="btn-neutral"
							type="submit"
						>
							search gelbooru
						</button>
					</div>
					<div>
						<ul>
							{selectedTags.map((tag, key) => {
								return (
									<li key={key}>
										<span>{tag}</span>
										<span
											onClick={() => {
												removeTag(key);
											}}
										>
											X
										</span>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</form>
		</>
	);
};

export default Search;
