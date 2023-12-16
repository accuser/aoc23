import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";
import { lines } from "./helpers/string.js";

const DAY = basename(__filename, extname(__filename));

const CARDS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const CARDS_WILD = [
	"A",
	"K",
	"Q",
	"T",
	"9",
	"8",
	"7",
	"6",
	"5",
	"4",
	"3",
	"2",
	"J",
];

const rank1 = (
	a: { hand: string; type: number },
	b: { hand: string; type: number }
) => {
	if (a.type === b.type) {
		for (let i = 0; i < 5; i++) {
			const ai = CARDS.findIndex((v) => v === a.hand[i]);
			const bi = CARDS.findIndex((v) => v === b.hand[i]);

			if (ai === bi) {
				continue;
			} else {
				return bi - ai;
			}
		}
		return 0;
	} else {
		return b.type - a.type;
	}
};

const rank2 = (
	a: { hand: string; type: number },
	b: { hand: string; type: number }
) => {
	if (a.type === b.type) {
		for (let i = 0; i < 5; i++) {
			const ai = CARDS_WILD.findIndex((v) => v === a.hand[i]);
			const bi = CARDS_WILD.findIndex((v) => v === b.hand[i]);

			if (ai === bi) {
				continue;
			} else {
				return bi - ai;
			}
		}
		return 0;
	} else {
		return b.type - a.type;
	}
};

const type1 = (hand: string) => {
	const sorted = [...hand]
		.sort(
			(a, b) =>
				CARDS.findIndex((v) => v === a) - CARDS.findIndex((v) => v === b)
		)
		.join("");

	if (/(.)\1{4}/.test(sorted)) {
		return 0; // five of a kind
	} else if (/(.)\1{3}/.test(sorted)) {
		return 1; // four of a kind
	} else if (/(.)\1{2}(.)\2/.test(sorted)) {
		return 2; // full house
	} else if (/(.)\1(.)\2{2}/.test(sorted)) {
		return 2; // full house
	} else if (/(.)\1{2}/.test(sorted)) {
		return 3; // three of a kind
	} else if (/(.)\1.?(.)\2/.test(sorted)) {
		return 4; // two pair
	} else if (/(.)\1/.test(sorted)) {
		return 5; // pair
	} else {
		return 6;
	}
};

const type2 = (hand: string) => {
	const sorted = [...hand]
		.sort(
			(a, b) =>
				CARDS_WILD.findIndex((v) => v === a) -
				CARDS_WILD.findIndex((v) => v === b)
		)
		.join("");

	if (/(.)\1{4}/.test(sorted)) {
		return 0; // five of a kind
	} else if (/(.)\1{3}/.test(sorted)) {
		if (/J{4}/.test(sorted)) {
			return 0; // five of a kind
		} else if (/J/.test(sorted)) {
			return 0; // five of a kind
		} else {
			return 1; // four of a kind
		}
	} else if (/(.)\1{2}(.)\2/.test(sorted)) {
		if (/J/.test(sorted)) {
			return 0; // five of a kind
		} else {
			return 2; // full house
		}
	} else if (/(.)\1(.)\2{2}/.test(sorted)) {
		if (/J/.test(sorted)) {
			return 0; // five of a kind
		} else {
			return 2; // full house
		}
	} else if (/(.)\1{2}/.test(sorted)) {
		if (/J{3}/.test(sorted)) {
			return 1; // four of a kind
		} else if (/J/.test(sorted)) {
			return 1;
		} else {
			return 3; // three of a kind
		}
	} else if (/(.)\1.?(.)\2/.test(sorted)) {
		if (/J{2}/.test(sorted)) {
			return 1; // four of a kind
		} else if (/J/.test(sorted)) {
			return 2; // full house
		} else {
			return 4; // two pair
		}
	} else if (/(.)\1/.test(sorted)) {
		if (/J{1,2}/.test(sorted)) {
			return 3; // three of a kind
		} else {
			return 5; // pair
		}
	} else if (/J/.test(sorted)) {
		return 5; //pair
	} else {
		return 6;
	}
};

const part1 = (input: string) =>
	lines(input)
		.map((line) => line.split(" "))
		.map(([hand, bid]) => ({
			hand,
			type: type1(hand),
			bid: +bid,
		}))
		.sort(rank1)
		.reduce((p, { bid }, i) => p + bid * (i + 1), 0);

const part2 = (input: string) =>
	lines(input)
		.map((line) => line.split(" "))
		.map(([hand, bid]) => ({
			hand,
			type: type2(hand),
			bid: +bid,
		}))
		.sort(rank2)
		.reduce((p, { bid }, i) => p + bid * (i + 1), 0);

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	console.log("part 1 =>", part1(input));
	console.log("part 2 =>", part2(input));
}

describe(`${DAY} examples`, () => {
	test("part 1", () => {
		const input = "32T3K 765\nT55J5 684\nKK677 28\nKTJJT 220\nQQQJA 483";

		assert.equal(part1(input), 6440);
	});

	test("part 2", () => {
		const input = "32T3K 765\nT55J5 684\nKK677 28\nKTJJT 220\nQQQJA 483";

		assert.equal(part2(input), 5905);
	});
});
