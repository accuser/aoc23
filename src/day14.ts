import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { lines } from "./helpers/string";

const DAY = basename(__filename, extname(__filename));

const from = (input: string) => lines(input).map((line) => line.split(""));

const north = (platform: string[][]) => {
	for (let y = 1; y < platform.length; y++) {
		for (let x = 0; x < platform[0].length; x++) {
			if (platform[y][x] === "O") {
				let i = y;

				while (i && platform[i - 1][x] === ".") {
					i--;
				}

				platform[y][x] = ".";
				platform[i][x] = "O";
			}
		}
	}
};

const east = (platform: string[][]) => {
	for (let x = platform[0].length - 2; x >= 0; x--) {
		for (let y = 0; y < platform.length; y++) {
			if (platform[y][x] === "O") {
				let i = x;

				while (i < platform.length - 1 && platform[y][i + 1] === ".") {
					i++;
				}

				platform[y][x] = ".";
				platform[y][i] = "O";
			}
		}
	}
};

const south = (platform: string[][]) => {
	for (let y = platform.length - 2; y >= 0; y--) {
		for (let x = 0; x < platform[0].length; x++) {
			if (platform[y][x] === "O") {
				let i = y;

				while (i < platform.length - 1 && platform[i + 1][x] === ".") {
					i++;
				}

				platform[y][x] = ".";
				platform[i][x] = "O";
			}
		}
	}
};

const west = (platform: string[][]) => {
	for (let x = 1; x < platform[0].length; x++) {
		for (let y = 0; y < platform.length; y++) {
			if (platform[y][x] === "O") {
				let i = x;

				while (i && platform[y][i - 1] === ".") {
					i--;
				}

				platform[y][x] = ".";
				platform[y][i] = "O";
			}
		}
	}
};

const spin = (platform: string[][]) => {
	north(platform);
	west(platform);
	south(platform);
	east(platform);
};

const part1 = (input: string) => {
	const platform = from(input);

	north(platform);

	return platform.reduce(
		(p, c, index, { length }) =>
			p + (length - index) * c.reduce((p, c) => (c === "O" ? p + 1 : p), 0),
		0
	);
};

const part2 = (input: string) => {
	const platform = from(input);

	let s = new Set();
	let a: number[] = [];
	let h: number[] = [];

	let repeating = false;

	for (let i = 0; i < 1_000_000_000; i++) {
		spin(platform);

		const v = platform.reduce(
			(p, c, index, { length }) =>
				p + (length - index) * c.reduce((p, c) => (c === "O" ? p + 1 : p), 0),
			0
		);

		if (repeating) {
			let index = a.findIndex((value) => value === v);

			if (index === -1) {
				a.push(v);
				h.push(v);
			} else {
				if (a.every((v) => h.includes(v)) && a.length === h.length) {
					if ((1_000_000_000 - i) % (a.length + 1) === 1) {
						return v;
					}
				} else {
					a.push(v);
				}
			}
		} else {
			if (s.has(v)) {
				h.push(v);
				repeating = true;
			} else {
				s.add(v);
			}
		}
	}

	return platform.reduce(
		(p, c, index, { length }) =>
			p + (length - index) * c.reduce((p, c) => (c === "O" ? p + 1 : p), 0),
		0
	);
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
			"O....#....\nO.OO#....#\n.....##...\nOO.#O....O\n.O.....O#.\nO.#..O.#.#\n..O..#O..O\n.......O..\n#....###..\n#OO..#....";
		assert.equal(part1(input), 136);
	});

	test("part 2", () => {
		const input =
			"O....#....\nO.OO#....#\n.....##...\nOO.#O....O\n.O.....O#.\nO.#..O.#.#\n..O..#O..O\n.......O..\n#....###..\n#OO..#....";
		assert.equal(part2(input), 64);
	});
});
