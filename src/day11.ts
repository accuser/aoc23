import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { lines } from "./helpers/string";
import { sum } from "./helpers/number";
import exp from "node:constants";

const DAY = basename(__filename, extname(__filename));

const from = (input: string, expansion = 2) => {
	const rows = lines(input)
		.flatMap((line) =>
			/#/.test(line) ? [line] : [Array.from(line, () => "O").join("")]
		)
		.map((line) => line.split(""));

	for (let i = rows[0].length; i--; ) {
		if (rows.every((row) => /[.O]/.test(row[i]))) {
			rows.forEach((row) => row.splice(i, 1, "O"));
		}
	}

	let galaxies: { x: number; y: number }[] = [];

	rows.forEach((row, r, rows) => {
		row.forEach((col, c, cols) => {
			if (col === "#") {
				let y = 0;

				for (let i = 0; i < r; i++) {
					y += rows[i][c] === "O" ? expansion : 1;
				}

				let x = 0;

				for (let j = 0; j < c; j++) {
					x += cols[j] === "O" ? expansion : 1;
				}

				galaxies.push({ x, y });
			}
		});
	});

	let distances = 0;

	for (let g = 0; g < galaxies.length; g++) {
		for (let o = g + 1; o < galaxies.length; o++) {
			let a = galaxies[g];
			let b = galaxies[o];

			distances += Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
		}
	}

	return distances;
};

const part1 = (input: string) => from(input);

const part2 = (input: string, expansion: number) => from(input, expansion);

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	console.log("part 1 =>", part1(input));
	console.log("part 2 =>", part2(input, 1_000_000));
}

describe(`${DAY} examples`, () => {
	test("part 1", () => {
		const input =
			"...#......\n.......#..\n#.........\n..........\n......#...\n.#........\n.........#\n..........\n.......#..\n#...#.....";

		assert.equal(part1(input), 374);
	});

	test("part 2", () => {
		const input =
			"...#......\n.......#..\n#.........\n..........\n......#...\n.#........\n.........#\n..........\n.......#..\n#...#.....";

		assert.equal(part2(input, 10), 1030);
		assert.equal(part2(input, 100), 8410);
	});
});
