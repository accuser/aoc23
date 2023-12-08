import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { lines } from "./helpers/string.js";
import { primeFactors } from "./helpers/number.js";

const DAY = basename(__filename, extname(__filename));

const from = (input: string) => {
	const [instructions, elements] = input.split("\n\n");

	return {
		instructions,
		nodes: lines(elements)
			.map((line) => line.split(/[\s=(,)]/).filter(Boolean))
			.reduce(
				(p, [label, L, R]) => p.set(label, { L, R }),
				new Map<string, Record<string, string>>()
			),
	};
};

const travel = (
	start: string,
	nodes: Map<string, Record<string, string>>,
	instructions: string,
	finished: (label: string) => boolean
) => {
	let current = nodes.get(start)!;
	let next = 0;
	let step = 1;

	while (!finished(current[instructions[next]])) {
		current = nodes.get(current[instructions[next]])!;
		next = (next + 1) % instructions.length;
		step = step + 1;
	}

	return step;
};

const part1 = (input: string) => {
	const { instructions, nodes } = from(input);

	return travel("AAA", nodes, instructions, (label) => label === "ZZZ");
};

const part2 = (input: string) => {
	const { instructions, nodes } = from(input);

	return [
		...[...nodes.keys()]
			.filter((label) => label.endsWith("A"))
			.map((start) =>
				travel(start, nodes, instructions, (label) => label.endsWith("Z"))
			)
			.flatMap((steps) => [...primeFactors(steps)])
			.reduce((p, factor) => p.add(factor), new Set<number>()),
	].reduce((p, c) => p * c, 1);
};

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	console.log("part 1 =>", part1(input));
	console.log("part 2 =>", part2(input));
}

describe(`${DAY} examples`, () => {
	test("part 1a", () => {
		const input =
			"RL\n\nAAA = (BBB, CCC)\nBBB = (DDD, EEE)\nCCC = (ZZZ, GGG)\nDDD = (DDD, DDD)\nEEE = (EEE, EEE)\nGGG = (GGG, GGG)\nZZZ = (ZZZ, ZZZ)";

		assert.equal(part1(input), 2);
	});

	test("part 1b", () => {
		const input = "LLR\n\nAAA = (BBB, BBB)\nBBB = (AAA, ZZZ)\nZZZ = (ZZZ, ZZZ)";

		assert.equal(part1(input), 6);
	});

	test("part 2", () => {
		const input =
			"LR\n\n11A = (11B, XXX)\n11B = (XXX, 11Z)\n11Z = (11B, XXX)\n22A = (22B, XXX)\n22B = (22C, 22C)\n22C = (22Z, 22Z)\n22Z = (22B, 22B)\nXXX = (XXX, XXX)";

		assert.equal(part2(input), 6);
	});
});
