import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { lines } from "./helpers/string.js";
import { sum } from "./helpers/number.js";

const DAY = basename(__filename, extname(__filename));

type RegExpMatchArrayIndices = RegExpMatchArray & {
	indices: Array<[number, number]>;
};

const limit = (n: number, e: number) => Math.min(Math.max(n, 0), e);

const part1 = (input: string) =>
	lines(input)
		.map((line, idx, arr) =>
			[...line.matchAll(/(\d+)/dg)]
				.map((m) => [+m[0], ...(m as RegExpMatchArrayIndices).indices[0]])
				.reduce(
					(p, [v, s, e]) =>
						/[^\d.]/.test(
							[idx - 1, idx, idx + 1]
								.filter((v) => v === limit(v, arr.length - 1))
								.map((i) =>
									arr[i].slice(
										limit(s - 1, line.length),
										limit(e + 1, line.length)
									)
								)
								.filter(Boolean)
								.join("")
						)
							? p + v
							: p,
					0
				)
		)
		.flat()
		.reduce(sum);

const part2 = (input: string) =>
	lines(input)
		.map((line, idx, arr) =>
			[...line.matchAll(/\*/dg)]
				.map((m) => (m as RegExpMatchArrayIndices).indices[0])
				.map(([s, e]) =>
					[idx - 1, idx, idx + 1]
						.filter((v) => v === limit(v, arr.length - 1))
						.map((i) =>
							arr[i].slice(limit(s - 3, line.length), limit(e + 3, line.length))
						)
						.map((n) =>
							[...n.matchAll(/\d+/dg)]
								.map((m) => [
									+m[0],
									...(m as RegExpMatchArrayIndices).indices[0],
								])
								.filter(([n, s, e]) => s <= 4 && e >= 3)
								.map(([n]) => n)
						)
						.flat()
						.reduce((p, c, _, { length }) => (length > 1 ? p * c : 0), 1)
				)
		)
		.flat()
		.reduce(sum, 0);

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	console.log("part 1 =>", part1(input));
	console.log("part 2 =>", part2(input));
}

describe(`${DAY} examples`, () => {
	test("part 1", () => {
		const input =
			"467..114..\n...*......\n..35..633.\n......#...\n617*......\n.....+.58.\n..592.....\n......755.\n...$.*....\n.664.598..";

		assert.equal(part1(input), 4361);
	});

	test("part 2", () => {
		const input =
			"467..114..\n...*......\n..35..633.\n......#...\n617*......\n.....+.58.\n..592.....\n......755.\n...$.*....\n.664.598..";

		assert.equal(part2(input), 467835);
	});
});
