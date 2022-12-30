// Disclaimer: This code was written by ChatGPT (with minimal editing) and may not necessarily be the best solution for the problem.

const toNumber = (input: string): number => {
	// Use the Number function to try to convert the string to a number
	const n = Number(input);

	// Check if the result is a valid number
	if (isNaN(n)) {
		// Return 0 if the input is not a valid number
		return 0;
	} else {
		// Return the number if the input is a valid number
		return n;
	}
};

export default toNumber;
