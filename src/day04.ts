import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { lines } from "./helpers/string";
import { sum } from "./helpers/number";

const DAY = basename(__filename, extname(__filename));

const part1 = (input: string) =>
	lines(input)
		.map((line) => line.split(/[:|]/))
		.map(([_, winning, have]) => ({
			winning: winning.split(/\s+/).filter(Boolean),
			have: have.split(/\s+/).filter(Boolean),
		}))
		.map(
			({ winning, have }) =>
				have.length -
				(new Set([...winning, ...have]).size - new Set([...winning]).size)
		)
		.map((count) => (count === 0 ? 0 : 2 ** (count - 1)))
		.reduce(sum, 0);

const part2 = (input: string) => {
	let cards = lines(input)
		.map((line) => line.split(/[:|]/))
		.map(([card, winning, have]) => ({
			card: +card.match(/Card\s+(\d+)/)![1],
			winning: winning.split(/\s+/).filter(Boolean),
			have: have.split(/\s+/).filter(Boolean),
		}))
		.map(({ card, winning, have }) => ({
			card,
			points:
				have.length -
				(new Set([...winning, ...have]).size - new Set([...winning]).size),
			count: 1,
		}));

	cards.forEach(({ points, count }, index, array) => {
		for (let i = index + 1; i < index + 1 + points; i++) {
			array[i].count += count;
		}
	});

	return cards.map(({ count }) => count).reduce(sum, 0);
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
			"Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\nCard 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\nCard 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\nCard 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\nCard 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\nCard 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11";

		assert.equal(part1(input), 13);
	});

	test("part 2", () => {
		const input =
			"Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\nCard 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\nCard 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\nCard 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\nCard 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\nCard 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11";

		assert.equal(part2(input), 30);
	});
});
