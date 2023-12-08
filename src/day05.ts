import assert from "node:assert";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, test } from "node:test";

const DAY = basename(__filename, extname(__filename));

type Almanac = {
	seeds: number[];
	seed_to_soil: Function;
	soil_to_fertilizer: Function;
	fertilizer_to_water: Function;
	water_to_light: Function;
	light_to_temperature: Function;
	temperature_to_humidity: Function;
	humidity_to_location: Function;
};

const mapper =
	(destination: number, source: number, length: number) => (i: number) =>
		i >= source && i < source + length ? destination + i - source : i;

const from = (input: string): Almanac =>
	input
		.split("\n\n")
		.map((group) => group.split(":"))
		.map(([key, values]) => {
			if (key === "seeds") {
				return {
					[key]: values
						.split(" ")
						.filter(Boolean)
						.map((value) => +value),
				};
			} else {
				return {
					[key.split(" ")[0].replace(/\-/g, "_")]: values
						.split("\n")
						.filter(Boolean)
						.map((value) => value.split(" ").map((value) => +value))
						.map(([d, s, l]) => mapper(d, s, l))
						.reduce(
							(p, c, i, a) =>
								i
									? p
									: (s) => {
											for (i = 0; i < a.length; i++) {
												const m = a[i](s);
												if (m !== s) {
													return m;
												}
											}
											return s;
									  },
							(x: number) => x
						),
				};
			}
		})
		.reduce((p, c) => Object.assign(p, c), {}) as Almanac;

const part1 = (input: string) => {
	const almanac = from(input);

	return almanac
		.seeds!.map((seed) =>
			almanac.humidity_to_location(
				almanac.temperature_to_humidity(
					almanac.light_to_temperature(
						almanac.water_to_light(
							almanac.fertilizer_to_water(
								almanac.soil_to_fertilizer(almanac.seed_to_soil(seed))
							)
						)
					)
				)
			)
		)
		.reduce((p, c) => Math.min(p, c), Number.POSITIVE_INFINITY);
};

const part2 = (input: string) => {
	const almanac = from(input);

	const seeds = almanac.seeds.reduce((p, c, i, a) => {
		if (i % 2) {
			p.push([a[i - 1], a[i]]);
		}
		return p;
	}, [] as [number, number][]);

	let loc = Number.POSITIVE_INFINITY;

	for (const [start, range] of seeds) {
		console.log(start);
		for (let i = 0; i < range; i++) {
			const seed = start + i;

			loc = Math.min(
				loc,
				almanac.humidity_to_location(
					almanac.temperature_to_humidity(
						almanac.light_to_temperature(
							almanac.water_to_light(
								almanac.fertilizer_to_water(
									almanac.soil_to_fertilizer(almanac.seed_to_soil(seed))
								)
							)
						)
					)
				)
			);
		}
	}

	return loc;
};

if (require.main === module) {
	const input = readFileSync(resolve(".", "input", DAY)).toString();

	console.log(DAY);
	// console.log("part 1 =>", part1(input));
	console.log("part 2 =>", part2(input));
}

describe(`${DAY} examples`, () => {
	test("part 1", () => {
		const input =
			"seeds: 79 14 55 13\n\nseed-to-soil map:\n50 98 2\n52 50 48\n\nsoil-to-fertilizer map:\n0 15 37\n37 52 2\n39 0 15\n\nfertilizer-to-water map:\n49 53 8\n0 11 42\n42 0 7\n57 7 4\n\nwater-to-light map:\n88 18 7\n18 25 70\n\nlight-to-temperature map:\n45 77 23\n81 45 19\n68 64 13\n\ntemperature-to-humidity map:\n0 69 1\n1 0 69\n\nhumidity-to-location map:\n60 56 37\n56 93 4";

		assert.equal(part1(input), 35);
	});

	test("part 2", () => {
		const input =
			"seeds: 79 14 55 13\n\nseed-to-soil map:\n50 98 2\n52 50 48\n\nsoil-to-fertilizer map:\n0 15 37\n37 52 2\n39 0 15\n\nfertilizer-to-water map:\n49 53 8\n0 11 42\n42 0 7\n57 7 4\n\nwater-to-light map:\n88 18 7\n18 25 70\n\nlight-to-temperature map:\n45 77 23\n81 45 19\n68 64 13\n\ntemperature-to-humidity map:\n0 69 1\n1 0 69\n\nhumidity-to-location map:\n60 56 37\n56 93 4";

		assert.equal(part2(input), 46);
	});
});
