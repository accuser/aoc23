import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { NUMBER_REGEX, from, sum } from "./helpers/number.js";
import { lines, reverse } from "./helpers/string.js";

const DAY = basename(__filename, extname(__filename));
const FORWARD_REGEX = new RegExp(`${NUMBER_REGEX}|\\d`);
const REVERSE_REGEX = new RegExp(`${reverse(NUMBER_REGEX)}|\\d`);

const part1 = (input: string) =>
	lines(input)
		.map((line) => [line.match(/\d/)![0], reverse(line).match(/\d/)![0]])
		.map(([a, b]) => from(a) * 10 + from(b))
		.reduce(sum);

const part2 = (input: string) =>
	lines(input)
		.map((line) => [
			line.match(FORWARD_REGEX)![0],
			reverse(reverse(line).match(REVERSE_REGEX)![0]),
		])
		.map(([a, b]) => from(a) * 10 + from(b))
		.reduce(sum);

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	console.log("part 1 =>", part1(input));
	console.log("part 2 =>", part2(input));
}

describe(`${DAY} examples`, () => {
	test("part 1", () => {
		const input = "1abc2\npqr3stu8vwx\na1b2c3d4e5f\ntreb7uchet";

		assert.equal(part1(input), 142);
	});

	test("part 2", () => {
		const input =
			"two1nine\neightwothree\nabcone2threexyz\nxtwone3four\n4nineeightseven2\nzoneight234\n7pqrstsixteen";

		assert.equal(part2(input), 281);
	});
});
