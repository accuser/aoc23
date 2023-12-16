import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { lines } from "./helpers/string";

const DAY = basename(__filename, extname(__filename));

const HEADING = {
	d: [+1, 0],
	l: [0, -1],
	r: [0, +1],
	u: [-1, 0],
} as const;

type Heading = keyof typeof HEADING;

const from = (input: string) => lines(input).map((line) => line.split(""));

const move = (
	layout: string[][],
	energized: Record<Heading, string[][]>,
	y = 0,
	x = 0,
	h: Heading = "r"
) => {
	while (y >= 0 && x >= 0 && y < layout.length && x < layout[0].length) {
		if (energized[h][y][x] === "#") {
			break;
		} else {
			energized[h][y][x] = "#";
		}

		const c = layout[y][x];

		if (c === "/") {
			if (h === "d") {
				h = "l";
			} else if (h === "l") {
				h = "d";
			} else if (h === "r") {
				h = "u";
			} else if (h === "u") {
				h = "r";
			}
		} else if (c === "\\") {
			if (h === "d") {
				h = "r";
			} else if (h === "l") {
				h = "u";
			} else if (h === "r") {
				h = "d";
			} else if (h === "u") {
				h = "l";
			}
		} else if (c === "-" && (h === "d" || h === "u")) {
			move(layout, energized, y + HEADING["l"][0], x + HEADING["l"][1], "l");
			move(layout, energized, y + HEADING["r"][0], x + HEADING["r"][1], "r");
			break;
		} else if (c === "|" && (h === "l" || h === "r")) {
			move(layout, energized, y + HEADING["d"][0], x + HEADING["d"][1], "d");
			move(layout, energized, y + HEADING["u"][0], x + HEADING["u"][1], "u");
			break;
		}

		y += HEADING[h][0];
		x += HEADING[h][1];
	}
};

const energize = (layout: string[][], y = 0, x = 0, h: Heading = "r") => {
	const energized: Record<Heading, string[][]> = {
		d: Array.from(layout),
		l: Array.from(layout),
		r: Array.from(layout),
		u: Array.from(layout),
	};

	move(layout, energized, y, x, h);

	let result = 0;

	for (let y = 0; y < layout.length; y++) {
		for (let x = 0; x < layout[y].length; x++) {
			if (
				energized["d"][y][x] === "#" ||
				energized["l"][y][x] === "#" ||
				energized["r"][y][x] === "#" ||
				energized["u"][y][x] === "#"
			) {
				result += 1;
			}
		}
	}

	return result;
};

const part1 = (input: string) => energize(from(input));

const part2 = (input: string) => {
	const layout = from(input);

	let result = 0;

	for (let y = 0; y < layout.length; y++) {
		["d", "l", "r", "u"].forEach((h) => {
			result = Math.max(
				result,
				energize(layout, y, 0, h as Heading),
				energize(layout, y, layout[0].length - 1, h as Heading)
			);
		});
	}

	for (let x = 0; x < layout[0].length; x++) {
		["d", "l", "r", "u"].forEach((h) => {
			result = Math.max(
				result,
				energize(layout, 0, x, h as Heading),
				energize(layout, layout.length - 1, x, h as Heading)
			);
		});
	}

	return result;
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
			".|...\\....\n|.-.\\.....\n.....|-...\n........|.\n..........\n.........\\\n..../.\\\\..\n.-.-/..|..\n.|....-|.\\\n..//.|....";

		assert.equal(part1(input), 46);
	});

	test("part 2", () => {
		const input =
			".|...\\....\n|.-.\\.....\n.....|-...\n........|.\n..........\n.........\\\n..../.\\\\..\n.-.-/..|..\n.|....-|.\\\n..//.|....";

		assert.equal(part2(input), 51);
	});
});
