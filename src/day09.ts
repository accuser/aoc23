import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { lines } from "./helpers/string";
import { sum } from "./helpers/number";

const DAY = basename(__filename, extname(__filename));

const next = (sequence: number[]): number => {
	if (sequence.every((v) => v === 0)) {
		return 0;
	} else {
		return (
			sequence.at(-1)! +
			next(
				sequence.reduce(
					(p, c, i, a) => (i ? [...p, a[i] - a[i - 1]] : p),
					[] as number[]
				)
			)
		);
	}
};

const prev = (sequence: number[]): number => {
	if (sequence.every((v) => v === 0)) {
		return 0;
	} else {
		return (
			sequence.at(0)! -
			prev(
				sequence.reduce(
					(p, c, i, a) => (i ? [...p, a[i] - a[i - 1]] : p),
					[] as number[]
				)
			)
		);
	}
};

const from = (input: string) =>
	lines(input).map((line) => line.split(/\s+/).map((v) => +v));

const part1 = (input: string) =>
	from(input)
		.map((sequence) => next(sequence))
		.reduce(sum, 0);

const part2 = (input: string) =>
	from(input)
		.map((sequence) => prev(sequence))
		.reduce(sum, 0);

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	console.log("part 1 =>", part1(input));
	console.log("part 2 =>", part2(input));
}

describe(`${DAY} examples`, () => {
	test("part 1", () => {
		const input = "0 3 6 9 12 15\n1 3 6 10 15 21\n10 13 16 21 30 45";

		assert.equal(part1(input), 114);
	});

	test("part 2", () => {
		const input = "10 13 16 21 30 45";

		assert.equal(part2(input), 5);
	});
});
