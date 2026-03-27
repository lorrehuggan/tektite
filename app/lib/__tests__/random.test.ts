import { describe, expect, test } from "bun:test";
import { CITIES, DRUGS } from "../../game/constants";
import { applyPriceEvent, generatePrices, rollEncounter, rollPriceEvent } from "../random";

describe("generatePrices", () => {
  test("returns prices for every city and drug", () => {
    const prices = generatePrices(() => 0.5);

    expect(Object.keys(prices)).toEqual([...CITIES]);

    for (const city of CITIES) {
      expect(Object.keys(prices[city])).toEqual([...DRUGS]);
      for (const drug of DRUGS) {
        expect(prices[city][drug]).toBeGreaterThan(0);
      }
    }
  });

  test("rolls deterministic price events", () => {
    expect(rollPriceEvent(() => 0.1)).toBe(true);
    expect(rollPriceEvent(() => 0.5)).toBe(false);
  });

  test("rolls encounters within chance and provides details", () => {
    expect(rollEncounter(() => 0.5)).toBeNull();

    const encounter = rollEncounter(() => 0.1);
    expect(encounter).not.toBeNull();
    expect(encounter?.choices.length).toBe(3);
    expect(["police", "mugger", "dealer"]).toContain(encounter!.type);
  });

  test("applies a price event to one city and drug", () => {
    const prices = generatePrices(() => 0.5);
    const next = applyPriceEvent(prices, () => 0);

    expect(next).not.toBe(prices);
    expect(Object.keys(next)).toEqual([...CITIES]);
    expect(Object.keys(next.camden)).toEqual([...DRUGS]);
  });
});
