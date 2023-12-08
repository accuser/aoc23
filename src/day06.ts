import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { lines } from "./helpers/string";

const DAY = basename(__filename, extname(__filename));

const from = (input: string) =>
	lines(input)
		.map((line) => line.split(":"))
		.map(([key, values]) => ({
			[key.toLowerCase()]: values
				.split(" ")
				.filter(Boolean)
				.map((value) => +value),
		}))
		.reduce((p, c) => Object.assign(p, c), {});

const part1 = (input: string) => {
	const { time: times, distance: records } = lines(input)
		.map((line) => line.split(":"))
		.map(([key, values]) => ({
			[key.toLowerCase()]: values
				.split(" ")
				.filter(Boolean)
				.map((value) => +value),
		}))
		.reduce((p, c) => Object.assign(p, c), {});

	const ways: number[] = [];

	for (let race = 0; race < times.length; race++) {
		const time = times[race];
		const record = records[race];

		let strategies = 0;

		for (let t = 0; t <= time; t++) {
			const dist = t * (time - t);

			if (dist > record) {
				strategies += 1;
			}
		}

		if (strategies) {
			ways.push(strategies);
		}
	}

	return ways.reduce((p, c) => p * c, 1);
};

const part2 = (input: string) => {
	const { time: times, distance: records } = lines(input)
		.map((line) => line.split(":"))
		.map(([key, values]) => ({
			[key.toLowerCase()]: [+values.split(" ").join("")],
		}))
		.reduce((p, c) => Object.assign(p, c), {});

	const ways: number[] = [];

	for (let race = 0; race < times.length; race++) {
		const time = times[race];
		const record = records[race];

		let strategies = 0;

		for (let t = 0; t <= time; t++) {
			const dist = t * (time - t);

			if (dist > record) {
				strategies += 1;
			}
		}

		if (strategies) {
			ways.push(strategies);
		}
	}

	return ways.reduce((p, c) => p * c, 1);
};

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	// console.log("part 1 =>", part1(input));
	// console.log("part 2 =>", part2(input));
}

describe(`${DAY} examples`, () => {
	// test("part 1", () => {
	// 	const input = "Time:      7  15   30\nDistance:  9  40  200";

	// 	assert.equal(part1(input), 288);
	// });

	test("part 2", () => {
		const input = "Time:      7  15   30\nDistance:  9  40  200";

		assert.equal(part2(input), 71503);
	});
});
