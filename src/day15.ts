import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { sum } from "./helpers/number";

const DAY = basename(__filename, extname(__filename));

const hash = (s: string) =>
	[...s].reduce((p, c) => ((p + c.charCodeAt(0)) * 17) % 256, 0);

const perform = (
	boxes: { label: string; fl: number }[][],
	[, label, op, fl]: string[]
) => {
	const box = boxes[hash(label)];

	if (op === "=") {
		const i = box.findIndex((lens) => lens.label === label);

		if (i === -1) {
			box.push({ label, fl: +fl });
		} else {
			box[i].fl = +fl;
		}
	} else if (op === "-") {
		const i = box.findIndex((lens) => lens.label === label);

		if (i === -1) {
			// noop
		} else {
			box.splice(i, 1);
		}
	}

	return boxes;
};

const part1 = (input: string) => input.split(",").map(hash).reduce(sum, 0);

const part2 = (input: string) =>
	input
		.split(",")
		.map((step) => step.match(/(\w+)([-=])(\d+)?/)!)
		.reduce(
			perform,
			Array.from({ length: 256 }, () => []) as { label: string; fl: number }[][]
		)
		.map((box, idx) =>
			box.reduce((p, { fl }, i) => p + (idx + 1) * (i + 1) * fl, 0)
		)
		.reduce(sum, 0);

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	console.log("part 1 =>", part1(input));
	console.log("part 2 =>", part2(input));
}

describe(`${DAY} examples`, () => {
	test("part 1", () => {
		const input = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7";

		assert.equal(part1(input), 1320);
	});

	test("part 2", () => {
		const input = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7";

		assert.equal(part2(input), 145);
	});
});
