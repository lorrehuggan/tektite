import { DRUG_BASE_PRICES } from "./constants";
import type { Drug, GameState, PriceIndicator } from "./types";

export function selectCurrentPrices(state: GameState) {
  return state.prices[state.currentCity];
}

export function selectInventoryCount(state: GameState): number {
  return Object.values(state.inventory).reduce((total, quantity) => total + quantity, 0);
}

export function selectInventoryValue(state: GameState): number {
  const prices = selectCurrentPrices(state);

  return Object.entries(state.inventory).reduce((total, [drug, quantity]) => {
    return total + quantity * prices[drug as Drug];
  }, 0);
}

export function selectNetWorth(state: GameState): number {
  return state.cash - state.debt + selectInventoryValue(state);
}

export function selectMaxAffordable(state: GameState, drug: Drug): number {
  const price = selectCurrentPrices(state)[drug];

  if (price <= 0) return 0;

  return Math.floor(state.cash / price);
}

export function selectMaxSellable(state: GameState, drug: Drug): number {
  return state.inventory[drug];
}

export function selectPriceIndicator(state: GameState, drug: Drug): PriceIndicator {
  const currentPrice = selectCurrentPrices(state)[drug];
  const basePrice = DRUG_BASE_PRICES[drug];

  if (currentPrice > basePrice) return "up";
  if (currentPrice < basePrice) return "down";
  return "neutral";
}

export function getEndingFlavor(state: GameState): string {
  const netWorth = selectNetWorth(state);

  if (netWorth >= 25000) return "Legendary";
  if (netWorth >= 10000) return "Elite";
  if (netWorth >= 2000) return "Prosperous";
  if (netWorth >= 0) return "Scrappy";
  if (netWorth >= -10000) return "Struggling";
  return "Deep debt";
}
