import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { lines } from "./helpers/string";

const DAY = basename(__filename, extname(__filename));

const from = (input: string) => {
	const map = lines(input).map((line) => line.split(""));
	const y = map.findIndex((v) => v.find((v) => v === "S"));
	const x = map[y].findIndex((v) => v === "S");

	let newMap = Array.from({ length: map.length * 3 }, () => "");

	let height = map.length;
	let width = map[0].length;

	{
		let n = false;
		let e = false;
		let s = false;
		let w = false;

		if (
			map[y - 1][x] === "|" ||
			map[y - 1][x] === "7" ||
			map[y - 1][x] === "F"
		) {
			n = true;
		}
		if (
			map[y][x + 1] === "-" ||
			map[y][x + 1] === "J" ||
			map[y][x + 1] === "7"
		) {
			e = true;
		}
		if (
			map[y + 1][x] === "|" ||
			map[y + 1][x] === "J" ||
			map[y + 1][x] === "L"
		) {
			s = true;
		}
		if (
			map[y][x - 1] === "-" ||
			map[y][x - 1] === "L" ||
			map[y][x - 1] === "F"
		) {
			w = true;
		}

		if (n && s) {
			map[y][x] = "|";
		} else if (e && w) {
			map[y][x] = "-";
		} else if (n && e) {
			map[y][x] = "L";
		} else if (n && w) {
			map[y][x] = "J";
		} else if (s && w) {
			map[y][x] = "7";
		} else if (s && e) {
			map[y][x] = "F";
		}
	}

	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			let n = false;
			let e = false;
			let s = false;
			let w = false;

			if (map[i][j] === "|" || map[i][j] === "7" || map[i][j] === "F") {
				s = true;
			}

			if (map[i][j] === "-" || map[i][j] === "J" || map[i][j] === "7") {
				w = true;
			}

			if (map[i][j] === "|" || map[i][j] === "J" || map[i][j] === "L") {
				n = true;
			}

			if (map[i][j] === "-" || map[i][j] === "L" || map[i][j] === "F") {
				e = true;
			}

			let k = i * 3 + 1;

			newMap[k - 1] += n ? ".|." : "...";
			newMap[k] += (w ? "-" : ".") + map[i][j] + (e ? "-" : ".");
			newMap[k + 1] += s ? ".|." : "...";
		}
	}

	return { map: newMap, start: { x, y } };
};

const part1 = (input: string) => {
	const { map, start } = from(input);

	let y = start.y * 3 + 1;
	let x = start.x * 3 + 1;

	let d: "N" | "E" | "S" | "W" | undefined =
		map[y][x] === "|" || map[y][x] === "J" || map[y][x] === "L"
			? "N"
			: map[y][x] === "-" || map[y][x] === "F"
			? "E"
			: map[y][x] === "7"
			? "S"
			: undefined;
	let s = 0;

	do {
		if (d === "N") {
			y = y - 3;

			if (map[y][x] === "|") {
			} else if (map[y][x] === "7") {
				d = "W";
			} else if (map[y][x] === "F") {
				d = "E";
			}
		} else if (d === "E") {
			x = x + 3;

			if (map[y][x] === "-") {
			} else if (map[y][x] === "7") {
				d = "S";
			} else if (map[y][x] === "J") {
				d = "N";
			}
		} else if (d === "S") {
			y = y + 3;

			if (map[y][x] === "|") {
			} else if (map[y][x] === "J") {
				d = "W";
			} else if (map[y][x] === "L") {
				d = "E";
			}
		} else if (d === "W") {
			x = x - 3;

			if (map[y][x] === "-") {
			} else if (map[y][x] === "F") {
				d = "S";
			} else if (map[y][x] === "L") {
				d = "N";
			}
		}

		s = s + 1;
	} while (!(x === start.x * 3 + 1 && y === start.y * 3 + 1));

	return s / 2;
};

const fill = (
	map: string[][],
	y: number,
	x: number,
	target: string,
	replacement: string
) => {
	if (
		y < 0 ||
		y >= map.length ||
		x < 0 ||
		x >= map[y].length ||
		map[y][x] !== target
	) {
		return;
	}

	map[y][x] = replacement;

	fill(map, y - 1, x, target, replacement);
	fill(map, y, x + 1, target, replacement);
	fill(map, y + 1, x, target, replacement);
	fill(map, y, x - 1, target, replacement);
};

function findEnclosed(map: string[][]) {
	for (let i = 0; i < map.length; i++) {
		if (map[i][0] === ".") fill(map, i, 0, ".", "O");
		if (map[i][map[i].length - 1] === ".")
			fill(map, i, map[i].length - 1, ".", "O");
	}
	for (let j = 0; j < map[0].length; j++) {
		if (map[0][j] === ".") fill(map, 0, j, ".", "O");
		if (map[map.length - 1][j] === ".") fill(map, map.length - 1, j, ".", "O");
	}

	for (let i = 1; i < map.length; i += 3) {
		for (let j = 1; j < map[i].length; j += 3) {
			if (map[i][j] === ".") {
				map[i][j] = "I";
			}
		}
	}

	let enclosedDots = 0;

	for (let i = 1; i < map.length; i += 3) {
		let z = "";
		for (let j = 1; j < map[0].length; j += 3) {
			z += map[i][j];
			if (map[i][j] === "I") {
				enclosedDots += 1;
			}
		}
	}

	return enclosedDots;
}

const part2 = (input: string) => {
	const { map, start } = from(input);

	let newMap = Array.from({ length: map.length }, () =>
		Array.from({ length: map[0].length }, () => ".")
	);

	let y = start.y * 3 + 1;
	let x = start.x * 3 + 1;

	let d: "N" | "E" | "S" | "W" | undefined =
		map[y][x] === "|" || map[y][x] === "J" || map[y][x] === "L"
			? "N"
			: map[y][x] === "-" || map[y][x] === "F"
			? "E"
			: map[y][x] === "7"
			? "S"
			: undefined;
	let s = 0;

	if (d === undefined) {
		process.exit();
	}

	do {
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				newMap[y + i][x + j] = map[y + i][x + j];
			}
		}

		if (d === "N") {
			y = y - 3;

			if (map[y][x] === "|") {
				// do nothing
			} else if (map[y][x] === "7") {
				d = "W";
			} else if (map[y][x] === "F") {
				d = "E";
			}
		} else if (d === "E") {
			x = x + 3;

			if (map[y][x] === "-") {
			} else if (map[y][x] === "7") {
				d = "S";
			} else if (map[y][x] === "J") {
				d = "N";
			}
		} else if (d === "S") {
			y = y + 3;
			if (map[y][x] === "|") {
			} else if (map[y][x] === "J") {
				d = "W";
			} else if (map[y][x] === "L") {
				d = "E";
			}
		} else if (d === "W") {
			x = x - 3;

			if (map[y][x] === "-") {
			} else if (map[y][x] === "F") {
				d = "S";
			} else if (map[y][x] === "L") {
				d = "N";
			}
		}

		s = s + 1;
	} while (!(x === start.x * 3 + 1 && y === start.y * 3 + 1));

	return findEnclosed(newMap);
};

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	console.log("part 1 =>", part1(input));
	console.log("part 2 =>", part2(input));
}

describe(`${DAY} examples`, () => {
	test("part 1", () => {
		const input = ".....\n.S-7.\n.|.|.\n.L-J.\n.....";
		assert.equal(part1(input), 4);
	});

	test("part 1a", () => {
		const input = "..F7.\n.FJ|.\nSJ.L7\n|F--J\nLJ...";
		assert.equal(part1(input), 8);
	});

	test("part 2", () => {
		const input =
			"...........\n.S-------7.\n.|F-----7|.\n.||.....||.\n.||.....||.\n.|L-7.F-J|.\n.|..|.|..|.\n.L--J.L--J.\n...........";
		assert.equal(part2(input), 4);
	});

	test("part 2a", () => {
		const input =
			".F----7F7F7F7F-7....\n.|F--7||||||||FJ....\n.||.FJ||||||||L7....\nFJL7L7LJLJ||LJ.L-7..\nL--J.L7...LJS7F-7L7.\n....F-J..F7FJ|L7L7L7\n....L7.F7||L7|.L7L7|\n.....|FJLJ|FJ|F7|.LJ\n....FJL-7.||.||||...\n....L---J.LJ.LJLJ...";
		assert.equal(part2(input), 8);
	});
});
