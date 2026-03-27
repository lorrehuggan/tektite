import { describe, expect, test } from "bun:test";
import { CITIES, DRUG_BASE_PRICES, DRUGS } from "../constants";
import { gameReducer } from "../reducer";
import { createInitialState } from "../state";
import {
  getEndingFlavor,
  selectCurrentPrices,
  selectInventoryCount,
  selectInventoryValue,
  selectMaxAffordable,
  selectMaxSellable,
  selectNetWorth,
  selectPriceIndicator,
} from "../selectors";
import type { PricesByCity } from "../types";

function createPrices(overrides?: Partial<Record<(typeof CITIES)[number], Partial<Record<(typeof DRUGS)[number], number>>>>): PricesByCity {
  return Object.fromEntries(
    CITIES.map((city) => [
      city,
      Object.fromEntries(
        DRUGS.map((drug) => [
          drug,
          overrides?.[city]?.[drug] ?? DRUG_BASE_PRICES[drug],
        ]),
      ),
    ]),
  ) as PricesByCity;
}

describe("game state", () => {
  test("creates a valid initial state", () => {
    const prices = createPrices();
    const state = createInitialState(prices);

    expect(state.day).toBe(1);
    expect(state.cash).toBe(2000);
    expect(state.debt).toBe(5000);
    expect(state.health).toBe(100);
    expect(state.maxHealth).toBe(100);
    expect(state.inventoryCapacity).toBe(100);
    expect(state.currentCity).toBe("brixton");
    expect(state.prices).toBe(prices);
    expect(state.screen).toBe("title");
    expect(state.messageLog).toEqual([]);
    expect(state.activeEncounter).toBeNull();
  });

  test("new game resets state and enters market", () => {
    const prices = createPrices();
    const state = createInitialState(prices);
    const next = gameReducer(state, { type: "NEW_GAME", initialPrices: prices });

    expect(next.screen).toBe("market");
    expect(next.day).toBe(1);
    expect(next.cash).toBe(2000);
  });

  test("navigate updates screen", () => {
    const state = createInitialState(createPrices());
    const next = gameReducer(state, { type: "NAVIGATE", screen: "travel" });

    expect(next.screen).toBe("travel");
  });

  test("buys a drug when valid", () => {
    const prices = createPrices({ brixton: { weed: 250 } });
    const state = createInitialState(prices);
    const next = gameReducer(state, { type: "BUY", drug: "weed", quantity: 3 });

    expect(next.cash).toBe(2000 - 750);
    expect(next.inventory.weed).toBe(3);
    expect(next.messageLog.at(-1)).toBe("Bought 3 weed for £750.");
  });

  test("rejects buy when cash is insufficient", () => {
    const prices = createPrices({ brixton: { crack: 1500 } });
    const state = {
      ...createInitialState(prices),
      cash: 1000,
    };
    const next = gameReducer(state, { type: "BUY", drug: "crack", quantity: 1 });

    expect(next.cash).toBe(1000);
    expect(next.inventory.crack).toBe(0);
    expect(next.messageLog.at(-1)).toBe("Not enough cash to buy crack.");
  });

  test("rejects buy when capacity is insufficient", () => {
    const prices = createPrices({ brixton: { shrooms: 200 } });
    const state = {
      ...createInitialState(prices),
      inventory: {
        weed: 99,
        pills: 0,
        powder: 0,
        crack: 0,
        shrooms: 0,
      },
    };
    const next = gameReducer(state, { type: "BUY", drug: "shrooms", quantity: 2 });

    expect(next.inventory.shrooms).toBe(0);
    expect(next.messageLog.at(-1)).toBe("Not enough capacity to buy shrooms.");
  });

  test("sells a drug when valid", () => {
    const prices = createPrices({ brixton: { pills: 700 } });
    const state = {
      ...createInitialState(prices),
      inventory: {
        weed: 0,
        pills: 2,
        powder: 0,
        crack: 0,
        shrooms: 0,
      },
    };
    const next = gameReducer(state, { type: "SELL", drug: "pills", quantity: 1 });

    expect(next.cash).toBe(2000 + 700);
    expect(next.inventory.pills).toBe(1);
    expect(next.messageLog.at(-1)).toBe("Sold 1 pills for £700.");
  });

  test("rejects sell when inventory is insufficient", () => {
    const state = createInitialState(createPrices());
    const next = gameReducer(state, { type: "SELL", drug: "weed", quantity: 1 });

    expect(next.inventory.weed).toBe(0);
    expect(next.messageLog.at(-1)).toBe("Not enough weed to sell.");
  });

  test("pays debt and handles overpayment", () => {
    const state = {
      ...createInitialState(createPrices()),
      cash: 7000,
    };
    const next = gameReducer(state, { type: "PAY_DEBT", amount: 6000 });

    expect(next.cash).toBe(2000);
    expect(next.debt).toBe(0);
    expect(next.messageLog.at(-1)).toBe("Paid £5000 toward your debt.");
  });

  test("rejects debt payment when cash is insufficient", () => {
    const state = {
      ...createInitialState(createPrices()),
      cash: 100,
    };
    const next = gameReducer(state, { type: "PAY_DEBT", amount: 200 });

    expect(next.cash).toBe(100);
    expect(next.debt).toBe(5000);
    expect(next.messageLog.at(-1)).toBe("Not enough cash to pay debt.");
  });

  test("travels forward a day and applies debt and health changes", () => {
    const prices = createPrices({ camden: { weed: 275 } });
    const state = {
      ...createInitialState(createPrices()),
      day: 3,
      debt: 1000,
      health: 92,
      currentCity: "brixton" as const,
    };

    const next = gameReducer(state, {
      type: "TRAVEL",
      city: "camden",
      newPrices: prices,
      encounter: null,
      priceEvent: true,
    });

    expect(next.day).toBe(4);
    expect(next.debt).toBe(1050);
    expect(next.health).toBe(100);
    expect(next.currentCity).toBe("camden");
    expect(next.prices).toBe(prices);
    expect(next.screen).toBe("market");
    expect(next.messageLog.at(-1)).toBe("The market shifted on the road.");
  });

  test("travels to encounter screen when encounter is present", () => {
    const state = createInitialState(createPrices());
    const next = gameReducer(state, {
      type: "TRAVEL",
      city: "soho",
      newPrices: createPrices(),
      encounter: {
        type: "police",
        description: "Police are nearby.",
        context: "A patrol blocks the street.",
        choices: ["Run", "Comply", "Bribe"],
      },
      priceEvent: false,
    });

    expect(next.screen).toBe("encounter");
    expect(next.activeEncounter?.type).toBe("police");
  });

  test("ends the game after the final day", () => {
    const state = {
      ...createInitialState(createPrices()),
      day: 30,
    };
    const next = gameReducer(state, {
      type: "TRAVEL",
      city: "hackney",
      newPrices: createPrices(),
      encounter: null,
      priceEvent: false,
    });

    expect(next.day).toBe(31);
    expect(next.screen).toBe("game_over");
    expect(next.messageLog.at(-1)).toBe("You reached the end of the game.");
  });

  test("resolves a police run success", () => {
    const state = {
      ...createInitialState(createPrices()),
      screen: "encounter" as const,
      activeEncounter: {
        type: "police" as const,
        description: "Police",
        context: "Patrol",
        choices: ["Run", "Comply", "Bribe"],
      },
    };

    const next = gameReducer(state, { type: "ENCOUNTER_CHOICE", choice: 1, outcomeRoll: 0.1 });

    expect(next.screen).toBe("market");
    expect(next.activeEncounter).toBeNull();
    expect(next.messageLog.at(-1)).toBe("You outran the police.");
  });

  test("resolves a police run failure", () => {
    const state = {
      ...createInitialState(createPrices()),
      screen: "encounter" as const,
      activeEncounter: {
        type: "police" as const,
        description: "Police",
        context: "Patrol",
        choices: ["Run", "Comply", "Bribe"],
      },
    };

    const next = gameReducer(state, { type: "ENCOUNTER_CHOICE", choice: 1, outcomeRoll: 0.9 });

    expect(next.health).toBe(85);
    expect(next.cash).toBe(1900);
    expect(next.messageLog.at(-1)).toBe("The police caught up and rough you up.");
  });

  test("resolves a police compliance encounter", () => {
    const state = {
      ...createInitialState(createPrices()),
      inventory: {
        weed: 1,
        pills: 2,
        powder: 3,
        crack: 4,
        shrooms: 5,
      },
      screen: "encounter" as const,
      activeEncounter: {
        type: "police" as const,
        description: "Police",
        context: "Patrol",
        choices: ["Run", "Comply", "Bribe"],
      },
    };

    const next = gameReducer(state, { type: "ENCOUNTER_CHOICE", choice: 2, outcomeRoll: 0.9 });

    expect(next.inventory.weed).toBe(0);
    expect(next.inventory.pills).toBe(0);
    expect(next.messageLog.at(-1)).toBe("You complied and lost your stash.");
  });

  test("resolves a mugger fight win", () => {
    const state = {
      ...createInitialState(createPrices()),
      screen: "encounter" as const,
      activeEncounter: {
        type: "mugger" as const,
        description: "Mugger",
        context: "Alley",
        choices: ["Fight", "Hand over cash", "Run"],
      },
    };

    const next = gameReducer(state, { type: "ENCOUNTER_CHOICE", choice: 1, outcomeRoll: 0.2 });

    expect(next.messageLog.at(-1)).toBe("You fought off the mugger.");
  });

  test("resolves a mugger run failure", () => {
    const state = {
      ...createInitialState(createPrices()),
      screen: "encounter" as const,
      activeEncounter: {
        type: "mugger" as const,
        description: "Mugger",
        context: "Alley",
        choices: ["Fight", "Hand over cash", "Run"],
      },
    };

    const next = gameReducer(state, { type: "ENCOUNTER_CHOICE", choice: 3, outcomeRoll: 0.9 });

    expect(next.health).toBe(90);
    expect(next.cash).toBe(1925);
    expect(next.messageLog.at(-1)).toBe("The mugger caught you as you ran.");
  });

  test("resolves a dealer purchase", () => {
    const state = {
      ...createInitialState(createPrices()),
      screen: "encounter" as const,
      activeEncounter: {
        type: "dealer" as const,
        description: "Dealer",
        context: "Offer",
        choices: ["Buy", "Decline", "Ask around"],
        deal: {
          drug: "weed" as const,
          quantity: 3,
          pricePerUnit: 100,
        },
      },
    };

    const next = gameReducer(state, { type: "ENCOUNTER_CHOICE", choice: 1, outcomeRoll: 0.5 });

    expect(next.cash).toBe(1700);
    expect(next.inventory.weed).toBe(3);
    expect(next.messageLog.at(-1)).toBe("You bought 3 weed for £300.");
  });

  test("resolves a dealer decline", () => {
    const state = {
      ...createInitialState(createPrices()),
      screen: "encounter" as const,
      activeEncounter: {
        type: "dealer" as const,
        description: "Dealer",
        context: "Offer",
        choices: ["Buy", "Decline", "Ask around"],
        deal: {
          drug: "weed" as const,
          quantity: 3,
          pricePerUnit: 100,
        },
      },
    };

    const next = gameReducer(state, { type: "ENCOUNTER_CHOICE", choice: 2, outcomeRoll: 0.5 });

    expect(next.inventory.weed).toBe(0);
    expect(next.messageLog.at(-1)).toBe("You declined the dealer's offer.");
  });

  test("resolves a dealer purchase the player cannot afford", () => {
    const state = {
      ...createInitialState(createPrices()),
      cash: 10,
      screen: "encounter" as const,
      activeEncounter: {
        type: "dealer" as const,
        description: "Dealer",
        context: "Offer",
        choices: ["Buy", "Decline", "Ask around"],
        deal: {
          drug: "weed" as const,
          quantity: 3,
          pricePerUnit: 100,
        },
      },
    };

    const next = gameReducer(state, { type: "ENCOUNTER_CHOICE", choice: 1, outcomeRoll: 0.5 });

    // Should still clear the encounter and return to market
    expect(next.cash).toBe(10);
    expect(next.inventory.weed).toBe(0);
    expect(next.activeEncounter).toBeNull();
    expect(next.screen).toBe("market");
    expect(next.messageLog.at(-1)).toBe("You could not afford the deal.");
  });

  test("resolves a dealer purchase the player cannot carry", () => {
    const state = {
      ...createInitialState(createPrices()),
      inventory: {
        weed: 0,
        pills: 0,
        powder: 0,
        crack: 0,
        shrooms: 99,
      },
      screen: "encounter" as const,
      activeEncounter: {
        type: "dealer" as const,
        description: "Dealer",
        context: "Offer",
        choices: ["Buy", "Decline", "Ask around"],
        deal: {
          drug: "weed" as const,
          quantity: 3,
          pricePerUnit: 100,
        },
      },
    };

    const next = gameReducer(state, { type: "ENCOUNTER_CHOICE", choice: 1, outcomeRoll: 0.5 });

    expect(next.activeEncounter).toBeNull();
    expect(next.screen).toBe("market");
    expect(next.messageLog.at(-1)).toBe("You could not carry the deal.");
  });

  test("ends the game when encounter damage reduces health to zero", () => {
    const state = {
      ...createInitialState(createPrices()),
      health: 10,
      screen: "encounter" as const,
      activeEncounter: {
        type: "mugger" as const,
        description: "Mugger",
        context: "Alley",
        choices: ["Fight", "Hand over cash", "Run"],
      },
    };

    const next = gameReducer(state, { type: "ENCOUNTER_CHOICE", choice: 3, outcomeRoll: 0.9 });

    expect(next.health).toBe(0);
    expect(next.screen).toBe("game_over");
  });
});

describe("selectors", () => {
  test("derive inventory and net worth values", () => {
    const prices = createPrices({ brixton: { weed: 250, pills: 700 } });
    const state = {
      ...createInitialState(prices),
      inventory: {
        weed: 2,
        pills: 1,
        powder: 0,
        crack: 0,
        shrooms: 3,
      },
    };

    expect(selectCurrentPrices(state).weed).toBe(250);
    expect(selectInventoryCount(state)).toBe(6);
    expect(selectInventoryValue(state)).toBe(250 * 2 + 700 + 200 * 3);
    expect(selectNetWorth(state)).toBe(2000 - 5000 + (250 * 2 + 700 + 200 * 3));
    expect(selectMaxAffordable(state, "weed")).toBe(8);
    expect(selectMaxSellable(state, "weed")).toBe(2);
  });

  test("caps max affordable by remaining capacity", () => {
    const prices = createPrices({ brixton: { shrooms: 10 } });
    const state = {
      ...createInitialState(prices),
      cash: 10000,
      inventory: {
        weed: 0,
        pills: 0,
        powder: 0,
        crack: 0,
        shrooms: 97,
      },
    };

    // Can afford 1000 by cash, but only 3 by capacity
    expect(selectMaxAffordable(state, "shrooms")).toBe(3);
  });

  test("reports price indicators against base price", () => {
    const prices = createPrices({ brixton: { weed: 350, pills: 500, powder: 900 } });
    const state = createInitialState(prices);

    expect(selectPriceIndicator(state, "weed")).toBe("up");
    expect(selectPriceIndicator(state, "pills")).toBe("neutral");
    expect(selectPriceIndicator(state, "powder")).toBe("down");
  });

  test("returns ending flavor tiers from net worth", () => {
    const rich = {
      ...createInitialState(createPrices()),
      cash: 30000,
      debt: 0,
    };
    const solid = {
      ...createInitialState(createPrices()),
      cash: 12000,
      debt: 0,
    };
    const poor = {
      ...createInitialState(createPrices()),
      cash: 0,
      debt: 6000,
    };

    expect(getEndingFlavor(rich)).toBe("Legendary");
    expect(getEndingFlavor(solid)).toBe("Elite");
    expect(getEndingFlavor(poor)).toBe("Struggling");
  });

  test("caps message log at ten entries", () => {
    let state = createInitialState(createPrices());

    for (let i = 0; i < 12; i += 1) {
      state = gameReducer(state, { type: "BUY", drug: "weed", quantity: 0 });
    }

    expect(state.messageLog).toHaveLength(10);
    expect(state.messageLog[0]).toBe("Choose a valid quantity to buy.");
  });
});
