export const compareArrays = (
	firstArr: Array<number | null>,
	secondArr: Array<number | null>
) => {
	// Find elements in firstArr that are not in secondArr
	const newNums = firstArr.filter((num) => !secondArr.includes(num));

	// Find elements in secondArr that are not in firstArr
	const removedNums = secondArr.filter((num) => !firstArr.includes(num));

	return { newNums, removedNums };
};
