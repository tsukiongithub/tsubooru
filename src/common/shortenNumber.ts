function shortenNumber(num: number): string {
	const suffixes = ["", "K", "M", "B", "T"];
	const magnitude = Math.floor(Math.log10(num) / 3);
	const suffix = suffixes[magnitude];
	const shortNum = Math.floor(num / Math.pow(10, magnitude * 3));
	return shortNum.toString() + suffix;
}

export default shortenNumber;
