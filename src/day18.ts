import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { lines } from "./helpers/string";
import { DiffieHellman } from "node:crypto";

const DAY = basename(__filename, extname(__filename));

const DIRECTION = {
	D: [+1, 0],
	L: [0, -1],
	R: [0, +1],
	U: [-1, 0],
} as const;

type Direction = keyof typeof DIRECTION;

const from = (input: string) =>
	lines(input).map((line) => {
		const [d, m, c] = line.split(/\s+/);
		return { d: d as Direction, m: +m, c };
	});

const area = (plan: { d: Direction; m: number }[]) => {
	const perimeter = plan.reduce((p, { m }) => p + m, 0);
	const area = Math.abs(
		plan
			.reduce(
				(p, { d, m }) => [
					...p,
					[
						p.at(-1)![0] + DIRECTION[d][0] * m,
						p.at(-1)![1] + DIRECTION[d][1] * m,
					],
				],
				[[1, 1]]
			)
			.reduce(
				(p, c, i, a) =>
					p +
					a[i][0] * a[(i + 1) % a.length][1] -
					a[i][1] * a[(i + 1) % a.length][0],
				0
			)
	);

	return (area - perimeter) / 2 + 1 + perimeter;
};

const part1 = (input: string) => area(from(input));

const part2 = (input: string) =>
	area(
		from(input).map(({ d, m, c }) => {
			const [, hex, dir] = c.match(/#([a-z0-9]{5})([a-z0-9])/)!;
			return {
				m: Number(`0x${hex}`),
				d: ["R", "D", "L", "U"][+dir] as Direction,
			};
		})
	);

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	console.log("part 1 =>", part1(input));
	console.log("part 2 =>", part2(input));
}

describe(`${DAY} examples`, () => {
	test("part 1", () => {
		const input =
			"R 6 (#70c710)\nD 5 (#0dc571)\nL 2 (#5713f0)\nD 2 (#d2c081)\nR 2 (#59c680)\nD 2 (#411b91)\nL 5 (#8ceee2)\nU 2 (#caa173)\nL 1 (#1b58a2)\nU 2 (#caa171)\nR 2 (#7807d2)\nU 3 (#a77fa3)\nL 2 (#015232)\nU 2 (#7a21e3)";
		assert.equal(part1(input), 62);
	});

	test("part 2", () => {
		const input =
			"R 6 (#70c710)\nD 5 (#0dc571)\nL 2 (#5713f0)\nD 2 (#d2c081)\nR 2 (#59c680)\nD 2 (#411b91)\nL 5 (#8ceee2)\nU 2 (#caa173)\nL 1 (#1b58a2)\nU 2 (#caa171)\nR 2 (#7807d2)\nU 3 (#a77fa3)\nL 2 (#015232)\nU 2 (#7a21e3)";
		assert.equal(part2(input), 952_408_144_115);
	});
});
