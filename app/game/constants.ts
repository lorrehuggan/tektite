export const DRUGS = ["weed", "pills", "powder", "crack", "shrooms"] as const;

export const CITIES = [
  "camden",
  "brixton",
  "shoreditch",
  "soho",
  "peckham",
  "hackney",
] as const;

export const SCREEN_NAMES = [
  "title",
  "market",
  "travel",
  "encounter",
  "game_over",
] as const;

export const GAME_CONFIG = {
  startingCash: 2000,
  startingDebt: 5000,
  startingHealth: 100,
  maxHealth: 100,
  inventoryCapacity: 100,
  startingDay: 1,
  maxDays: 30,
  interestRate: 0.05,
  healthRegen: 10,
} as const;

export const ENCOUNTER_CONFIG = {
  chance: 0.2,
  priceEventChance: 0.15,
} as const;

export const DRUG_BASE_PRICES = {
  weed: 300,
  pills: 500,
  powder: 1000,
  crack: 1500,
  shrooms: 200,
} as const;
