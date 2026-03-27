import { createContext, useContext, type ParentComponent } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { createInitialState } from "../game/state";
import { gameReducer } from "../game/reducer";
import type { GameAction, GameState, PricesByCity } from "../game/types";

interface GameContextValue {
  state: GameState;
  dispatch: (action: GameAction) => void;
}

const GameContext = createContext<GameContextValue>();

export const GameProvider: ParentComponent<{ initialPrices: PricesByCity }> = (props) => {
  const [state, setState] = createStore(createInitialState(props.initialPrices));

  const dispatch = (action: GameAction) => {
    setState(reconcile(gameReducer(state, action)));
  };

  return <GameContext.Provider value={{ state, dispatch }}>{props.children}</GameContext.Provider>;
};

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within GameProvider");
  }

  return ctx;
}
