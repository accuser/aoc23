import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { sum } from "./helpers/number";
import { lines } from "./helpers/string";

const DAY = basename(__filename, extname(__filename));

interface Game {
	game: number;
	reveals: Reveal[];
}

interface Reveal {
	[x: string]: number;
}

const from = (input: string): Game[] =>
	lines(input)
		.map((line) => line.split(":"))
		.map(([a, b]) => ({
			game: +a.match(/Game (\d+)/)![1],
			reveals: b
				.split(";")
				.map((each) => each.match(/(\d+)\s+(blue|green|red)/g)!)
				.map((match) =>
					match
						.map((each) => each.split(/\s+/))
						.map(([a, b]) => ({ [b]: +a }))
						.reduce(Object.assign, {})
				),
		}));

const part1 = (input: string) => {
	return from(input)
		.filter(({ reveals }) => {
			const r = reveals.filter(({ red = 0 }) => red > 12);
			const g = reveals.filter(({ green = 0 }) => green > 13);
			const b = reveals.filter(({ blue = 0 }) => blue > 14);

			return r.length + g.length + b.length === 0;
		})
		.reduce((p, { game }) => p + game, 0);
};

const part2 = (input: string) => {
	return from(input)
		.map(({ reveals }) => {
			const r = reveals.reduce((p, { red = 0 }) => Math.max(p, red), 0);
			const g = reveals.reduce((p, { green = 0 }) => Math.max(p, green), 0);
			const b = reveals.reduce((p, { blue = 0 }) => Math.max(p, blue), 0);

			return r * g * b;
		})
		.reduce(sum);
};

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	console.log("part 1 =>", part1(input));
	console.log("part 2 =>", part2(input));
}

describe(`${DAY} examples`, () => {
	test("part 1", () => {
		const input =
			"Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green\nGame 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue\nGame 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red\nGame 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red\nGame 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green";

		assert.equal(part1(input), 8);
	});

	test("part 2", () => {
		const input =
			"Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green\nGame 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue\nGame 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red\nGame 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red\nGame 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green";

		assert.equal(part2(input), 2286);
	});
});
