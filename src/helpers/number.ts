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
