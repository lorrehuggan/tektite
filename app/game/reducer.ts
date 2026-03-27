import { createInitialState } from "./state";
import { DRUGS } from "./constants";
import { selectCurrentPrices, selectInventoryCount } from "./selectors";
import type { GameAction, GameState } from "./types";

function appendMessage(state: GameState, message: string): GameState {
  return {
    ...state,
    messageLog: [...state.messageLog, message].slice(-10),
  };
}

function appendMessages(state: GameState, messages: string[]): GameState {
  return {
    ...state,
    messageLog: [...state.messageLog, ...messages].slice(-10),
  };
}

function finishEncounter(state: GameState, message: string): GameState {
  return appendMessage(
    {
      ...state,
      activeEncounter: null,
      screen: state.health <= 0 ? "game_over" : "market",
    },
    message,
  );
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "NEW_GAME":
      return {
        ...createInitialState(action.initialPrices),
        screen: "market",
      };
    case "NAVIGATE":
      return {
        ...state,
        screen: action.screen,
      };
    case "BUY": {
      if (action.quantity <= 0) {
        return appendMessage(state, "Choose a valid quantity to buy.");
      }

      const price = selectCurrentPrices(state)[action.drug];
      const totalCost = price * action.quantity;
      const availableCapacity = state.inventoryCapacity - selectInventoryCount(state);

      if (totalCost > state.cash) {
        return appendMessage(state, `Not enough cash to buy ${action.drug}.`);
      }

      if (action.quantity > availableCapacity) {
        return appendMessage(state, `Not enough capacity to buy ${action.drug}.`);
      }

      return appendMessage(
        {
          ...state,
          cash: state.cash - totalCost,
          inventory: {
            ...state.inventory,
            [action.drug]: state.inventory[action.drug] + action.quantity,
          },
        },
        `Bought ${action.quantity} ${action.drug} for £${totalCost}.`,
      );
    }
    case "SELL": {
      if (action.quantity <= 0) {
        return appendMessage(state, "Choose a valid quantity to sell.");
      }

      const owned = state.inventory[action.drug];
      if (action.quantity > owned) {
        return appendMessage(state, `Not enough ${action.drug} to sell.`);
      }

      const price = selectCurrentPrices(state)[action.drug];
      const totalValue = price * action.quantity;

      return appendMessage(
        {
          ...state,
          cash: state.cash + totalValue,
          inventory: {
            ...state.inventory,
            [action.drug]: owned - action.quantity,
          },
        },
        `Sold ${action.quantity} ${action.drug} for £${totalValue}.`,
      );
    }
    case "PAY_DEBT": {
      if (action.amount <= 0) {
        return appendMessage(state, "Choose a valid debt payment.");
      }

      if (state.cash < action.amount) {
        return appendMessage(state, "Not enough cash to pay debt.");
      }

      const amountPaid = Math.min(action.amount, state.debt);

      return appendMessage(
        {
          ...state,
          cash: state.cash - amountPaid,
          debt: state.debt - amountPaid,
        },
        `Paid £${amountPaid} toward your debt.`,
      );
    }
    case "TRAVEL": {
      const nextDay = state.day + 1;
      const debtInterest = Math.floor(state.debt * 0.05);
      const nextDebt = state.debt + debtInterest;
      const nextHealth = Math.min(state.maxHealth, state.health + 10);
      const messages = [
        `Traveled to ${action.city}.`,
        debtInterest > 0 ? `Debt grew by £${debtInterest}.` : "Debt stayed the same.",
        `Recovered to ${nextHealth} health.`,
      ];

      if (action.priceEvent) {
        messages.push("The market shifted on the road.");
      }

      if (nextDay > state.maxDays) {
        messages.push("You reached the end of the game.");
      }

      return appendMessages(
        {
          ...state,
          day: nextDay,
          debt: nextDebt,
          health: nextHealth,
          currentCity: action.city,
          prices: action.newPrices,
          activeEncounter: action.encounter,
          screen: nextDay > state.maxDays ? "game_over" : action.encounter ? "encounter" : "market",
        },
        messages,
      );
    }
    case "ENCOUNTER_CHOICE": {
      const encounter = state.activeEncounter;
      if (!encounter) return state;
      const resultMessages: string[] = [];
      let nextState = { ...state };

      if (encounter.type === "police") {
        if (action.choice === 1) {
          if (action.outcomeRoll < 0.5) {
            resultMessages.push("You outran the police.");
          } else {
            nextState.health = Math.max(0, nextState.health - 15);
            nextState.cash = Math.max(0, nextState.cash - 100);
            resultMessages.push("The police caught up and rough you up.");
          }
        } else if (action.choice === 2) {
          nextState.inventory = Object.fromEntries(DRUGS.map((drug) => [drug, 0])) as GameState["inventory"];
          resultMessages.push("You complied and lost your stash.");
        } else if (action.choice === 3) {
          const bribe = Math.min(500, nextState.cash);
          nextState.cash -= bribe;
          resultMessages.push(`You bribed the police for £${bribe}.`);
        }
      } else if (encounter.type === "mugger") {
        if (action.choice === 1) {
          if (action.outcomeRoll < 0.4) {
            resultMessages.push("You fought off the mugger.");
          } else {
            nextState.health = Math.max(0, nextState.health - 20);
            nextState.cash = Math.max(0, nextState.cash - 150);
            resultMessages.push("The mugger overpowered you.");
          }
        } else if (action.choice === 2) {
          const handedOver = Math.floor(nextState.cash * 0.3);
          nextState.cash -= handedOver;
          resultMessages.push(`You handed over £${handedOver}.`);
        } else if (action.choice === 3) {
          if (action.outcomeRoll < 0.6) {
            resultMessages.push("You slipped away from the mugger.");
          } else {
            nextState.health = Math.max(0, nextState.health - 10);
            nextState.cash = Math.max(0, nextState.cash - 75);
            resultMessages.push("The mugger caught you as you ran.");
          }
        }
      } else if (encounter.type === "dealer") {
        if (action.choice === 1 && encounter.deal) {
          const totalCost = encounter.deal.pricePerUnit * encounter.deal.quantity;
          const totalInventory = selectInventoryCount(nextState) + encounter.deal.quantity;
          if (totalCost > nextState.cash) {
            resultMessages.push("You could not afford the deal.");
          } else if (totalInventory > nextState.inventoryCapacity) {
            resultMessages.push("You could not carry the deal.");
          } else {
            nextState.cash -= totalCost;
            nextState.inventory = {
              ...nextState.inventory,
              [encounter.deal.drug]: nextState.inventory[encounter.deal.drug] + encounter.deal.quantity,
            };
            resultMessages.push(`You bought ${encounter.deal.quantity} ${encounter.deal.drug} for £${totalCost}.`);
          }
        } else {
          resultMessages.push("You declined the dealer's offer.");
        }
      }

      return finishEncounter(nextState, resultMessages.join(" "));
    }
    default:
      return state;
  }
}
