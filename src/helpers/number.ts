import { reverse } from "./string";

export const NUMBER_REGEX =
	/zero|one|two|three|four|five|six|seven|eight|nine|\d/g;

export const from = (s: string) => {
	if (Number.isNaN(+s)) {
		return [
			"zero",
			"one",
			"two",
			"three",
			"four",
			"five",
			"six",
			"seven",
			"eight",
			"nine",
		].findIndex((v) => v === s || v === reverse(s));
	} else return +s;
};

export const sum = (a: number = 0, b: number) => a + b;

function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
	let iterationCount = 0;
	for (let i = start; i < end; i += step) {
		iterationCount++;
		yield i;
	}
	return iterationCount;
}

export function* primeFactors(n: number) {
	while (n != 1) {
		const f = smallestFactor(n);
		yield f;
		n /= f;
	}
}

const smallestFactor = (n: number) => {
	if (n % 2 == 0) return 2;

	const end = Math.floor(Math.sqrt(n));

	for (let i = 3; i <= end; i += 2) {
		if (n % i == 0) return i;
	}

	return n;
};
