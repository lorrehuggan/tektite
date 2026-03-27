import { CITIES, DRUGS, SCREEN_NAMES } from "./constants";

export type Drug = (typeof DRUGS)[number];
export type City = (typeof CITIES)[number];
export type Screen = (typeof SCREEN_NAMES)[number];

export type PriceMap = Record<Drug, number>;
export type PricesByCity = Record<City, PriceMap>;
export type Inventory = Record<Drug, number>;

export type PriceIndicator = "up" | "down" | "neutral";

export type EncounterType = "police" | "mugger" | "dealer";

export interface ActiveEncounter {
  type: EncounterType;
  description: string;
  context: string;
  choices: readonly string[];
  deal?: {
    drug: Drug;
    quantity: number;
    pricePerUnit: number;
  };
}

export interface GameState {
  day: number;
  maxDays: number;
  cash: number;
  debt: number;
  health: number;
  maxHealth: number;
  inventory: Inventory;
  inventoryCapacity: number;
  currentCity: City;
  prices: PricesByCity;
  screen: Screen;
  messageLog: string[];
  activeEncounter: ActiveEncounter | null;
}

export interface NewGameAction {
  type: "NEW_GAME";
  initialPrices: PricesByCity;
}

export interface BuyAction {
  type: "BUY";
  drug: Drug;
  quantity: number;
}

export interface SellAction {
  type: "SELL";
  drug: Drug;
  quantity: number;
}

export interface PayDebtAction {
  type: "PAY_DEBT";
  amount: number;
}

export interface TravelAction {
  type: "TRAVEL";
  city: City;
  newPrices: PricesByCity;
  encounter: ActiveEncounter | null;
  priceEvent: boolean;
}

export interface EncounterChoiceAction {
  type: "ENCOUNTER_CHOICE";
  choice: 1 | 2 | 3;
  outcomeRoll: number;
}

export interface NavigateAction {
  type: "NAVIGATE";
  screen: Screen;
}

export type GameAction =
  | NewGameAction
  | BuyAction
  | SellAction
  | PayDebtAction
  | TravelAction
  | EncounterChoiceAction
  | NavigateAction;
