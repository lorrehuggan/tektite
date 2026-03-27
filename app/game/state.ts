import { CITIES, DRUGS, GAME_CONFIG } from "./constants";
import type { GameState, Inventory, PricesByCity } from "./types";

function createEmptyInventory(): Inventory {
  return Object.fromEntries(DRUGS.map((drug) => [drug, 0])) as Inventory;
}

export function createInitialState(initialPrices: PricesByCity): GameState {
  return {
    day: GAME_CONFIG.startingDay,
    maxDays: GAME_CONFIG.maxDays,
    cash: GAME_CONFIG.startingCash,
    debt: GAME_CONFIG.startingDebt,
    health: GAME_CONFIG.startingHealth,
    maxHealth: GAME_CONFIG.maxHealth,
    inventory: createEmptyInventory(),
    inventoryCapacity: GAME_CONFIG.inventoryCapacity,
    currentCity: CITIES[1],
    prices: initialPrices,
    screen: "title",
    messageLog: [],
    activeEncounter: null,
  };
}
