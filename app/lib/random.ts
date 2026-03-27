import { CITIES, DRUGS, DRUG_BASE_PRICES } from "../game/constants";
import type { ActiveEncounter, PricesByCity } from "../game/types";

type RandomSource = () => number;

export function generatePrices(random: RandomSource = Math.random): PricesByCity {
  return Object.fromEntries(
    CITIES.map((city) => [
      city,
      Object.fromEntries(
        DRUGS.map((drug) => {
          const basePrice = DRUG_BASE_PRICES[drug];
          const variation = 0.7 + random() * 0.6;
          return [drug, Math.max(1, Math.round(basePrice * variation))];
        }),
      ),
    ]),
  ) as PricesByCity;
}

export function rollPriceEvent(random: RandomSource = Math.random): boolean {
  return random() < 0.15;
}

export function applyPriceEvent(prices: PricesByCity, random: RandomSource = Math.random): PricesByCity {
  const city = CITIES[Math.floor(random() * CITIES.length)] ?? CITIES[0];
  const drug = DRUGS[Math.floor(random() * DRUGS.length)] ?? DRUGS[0];
  const direction = random() < 0.5 ? -1 : 1;
  const multiplier = 0.2 + random() * 0.4;
  const currentPrice = prices[city][drug];
  const adjustedPrice = Math.max(1, Math.round(currentPrice * (1 + direction * multiplier)));

  return {
    ...prices,
    [city]: {
      ...prices[city],
      [drug]: adjustedPrice,
    },
  };
}

function createEncounter(type: ActiveEncounter["type"]): ActiveEncounter {
  switch (type) {
    case "police":
      return {
        type,
        description: "Police are blocking the route.",
        context: "A patrol spots your bag while you're on the move.",
        choices: ["Run", "Comply", "Bribe"],
      };
    case "mugger":
      return {
        type,
        description: "A mugger steps out of an alley.",
        context: "They want your cash or your drugs.",
        choices: ["Fight", "Hand over cash", "Run"],
      };
    case "dealer":
      const drug = DRUGS[1] ?? DRUGS[0];
      return {
        type,
        description: "A dealer offers a hot tip.",
        context: "They have a small stack of product at a discount.",
        choices: ["Buy", "Decline", "Ask around"],
        deal: {
          drug,
          quantity: 3,
          pricePerUnit: Math.max(1, Math.round(DRUG_BASE_PRICES[drug] * 0.5)),
        },
      };
  }
}

export function rollEncounter(random: RandomSource = Math.random): ActiveEncounter | null {
  if (random() >= 0.2) return null;

  const encounterTypes: ActiveEncounter["type"][] = ["police", "mugger", "dealer"];
  const type = encounterTypes[Math.min(encounterTypes.length - 1, Math.floor(random() * encounterTypes.length))]!;
  return createEncounter(type);
}
