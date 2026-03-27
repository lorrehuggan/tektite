import { Match, Show, Switch, createSignal } from "solid-js";
import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/solid";
import { CITIES, DRUGS } from "../game/constants";
import { applyPriceEvent, generatePrices, rollEncounter, rollPriceEvent } from "../lib/random";
import { useGame } from "../lib/use-game";
import { TitleScreen } from "./title";
import { MarketScreen } from "./market";
import { TravelScreen } from "./travel";
import { EncounterScreen } from "./encounter";
import { GameOverScreen } from "./game-over";
import type { Drug } from "../game/types";
import type { TransactionModalState } from "./market";
type QuitState = "none" | "confirm";

function nextDrug(current: Drug): Drug {
  const index = DRUGS.indexOf(current);
  return DRUGS[(index + 1) % DRUGS.length]!;
}

function previousDrug(current: Drug): Drug {
  const index = DRUGS.indexOf(current);
  return DRUGS[(index - 1 + DRUGS.length) % DRUGS.length]!;
}

function firstTravelTarget(currentCity: (typeof CITIES)[number]): (typeof CITIES)[number] {
  return CITIES.find((city) => city !== currentCity) ?? currentCity;
}

function nextTravelTarget(current: (typeof CITIES)[number], currentCity: (typeof CITIES)[number]): (typeof CITIES)[number] {
  const cities = CITIES.filter((city) => city !== currentCity);
  const index = cities.indexOf(current);
  return cities[(index + 1) % cities.length]!;
}

function previousTravelTarget(current: (typeof CITIES)[number], currentCity: (typeof CITIES)[number]): (typeof CITIES)[number] {
  const cities = CITIES.filter((city) => city !== currentCity);
  const index = cities.indexOf(current);
  return cities[(index - 1 + cities.length) % cities.length]!;
}

export function AppShell() {
  const renderer = useRenderer();
  const dimensions = useTerminalDimensions();
  const { state, dispatch } = useGame();
  const [selectedDrug, setSelectedDrug] = createSignal<Drug>(DRUGS[0]);
  const [selectedCity, setSelectedCity] = createSignal<(typeof CITIES)[number]>(firstTravelTarget(state.currentCity));
  const [modal, setModal] = createSignal<TransactionModalState | null>(null);
  const [quitState, setQuitState] = createSignal<QuitState>("none");

  function openModal(kind: TransactionModalState["kind"]) {
    setModal({ kind, input: "", error: undefined });
  }

  function closeModal() {
    setModal(null);
  }

  function openQuitConfirm() {
    setQuitState("confirm");
  }

  function closeQuitConfirm() {
    setQuitState("none");
  }

  function commitModal() {
    const currentModal = modal();
    if (!currentModal) return;

    const amount = Number(currentModal.input);
    if (!Number.isInteger(amount) || amount <= 0) {
      setModal({ ...currentModal, error: "Enter a valid quantity." });
      return;
    }

    if (currentModal.kind === "buy") {
      dispatch({ type: "BUY", drug: selectedDrug(), quantity: amount });
    } else if (currentModal.kind === "sell") {
      dispatch({ type: "SELL", drug: selectedDrug(), quantity: amount });
    } else {
      dispatch({ type: "PAY_DEBT", amount });
    }

    closeModal();
  }

  function appendDigit(digit: string) {
    const currentModal = modal();
    if (!currentModal) return;

    setModal({ ...currentModal, input: `${currentModal.input}${digit}`, error: undefined });
  }

  function backspaceModalInput() {
    const currentModal = modal();
    if (!currentModal) return;

    setModal({ ...currentModal, input: currentModal.input.slice(0, -1), error: undefined });
  }

  useKeyboard((key) => {
    if (quitState() === "confirm") {
      if (key.name === "y") {
        renderer.destroy();
        return;
      }

      if (key.name === "n" || key.name === "escape") {
        closeQuitConfirm();
      }

      return;
    }

    if (key.name === "q") {
      if (state.screen === "title" || state.screen === "game_over") {
        renderer.destroy();
      } else {
        openQuitConfirm();
      }

      return;
    }

    if (state.screen === "title" && key.name === "n") {
      dispatch({ type: "NEW_GAME", initialPrices: generatePrices() });
      setSelectedDrug(DRUGS[0]);
      setSelectedCity(firstTravelTarget(state.currentCity));
      closeModal();
      return;
    }

    if (state.screen === "game_over" && key.name === "n") {
      dispatch({ type: "NEW_GAME", initialPrices: generatePrices() });
      setSelectedDrug(DRUGS[0]);
      setSelectedCity(firstTravelTarget(state.currentCity));
      closeModal();
      closeQuitConfirm();
      return;
    }

    if (state.screen === "market") {
      if (modal()) {
        if (key.name === "escape") {
          closeModal();
          return;
        }

        if (key.name === "enter") {
          commitModal();
          return;
        }

        if (key.name === "backspace" || key.name === "delete") {
          backspaceModalInput();
          return;
        }

        if (/^[0-9]$/.test(key.name)) {
          appendDigit(key.name);
        }

        return;
      }

      if (key.name === "up" || key.name === "k") {
        setSelectedDrug(previousDrug(selectedDrug()));
        return;
      }

      if (key.name === "down" || key.name === "j") {
        setSelectedDrug(nextDrug(selectedDrug()));
        return;
      }

      if (key.name === "b") {
        openModal("buy");
        return;
      }

      if (key.name === "s") {
        openModal("sell");
        return;
      }

      if (key.name === "p") {
        openModal("pay");
        return;
      }

      if (key.name === "t") {
        setSelectedCity(firstTravelTarget(state.currentCity));
        dispatch({ type: "NAVIGATE", screen: "travel" });
      }
    }

    if (state.screen === "travel") {
      if (key.name === "escape") {
        dispatch({ type: "NAVIGATE", screen: "market" });
        return;
      }

      if (key.name === "up" || key.name === "k") {
        setSelectedCity(previousTravelTarget(selectedCity(), state.currentCity));
        return;
      }

      if (key.name === "down" || key.name === "j") {
        setSelectedCity(nextTravelTarget(selectedCity(), state.currentCity));
        return;
      }

      if (key.name === "enter") {
        const prices = generatePrices();
        const priceEvent = rollPriceEvent();
        dispatch({
          type: "TRAVEL",
          city: selectedCity(),
          newPrices: priceEvent ? applyPriceEvent(prices) : prices,
          encounter: rollEncounter(),
          priceEvent,
        });
      }
    }

    if (state.screen === "encounter" && state.activeEncounter) {
      if (key.name === "escape") {
        dispatch({ type: "NAVIGATE", screen: "market" });
        return;
      }

      if (key.name === "1") {
        dispatch({ type: "ENCOUNTER_CHOICE", choice: 1, outcomeRoll: Math.random() });
        return;
      }

      if (key.name === "2") {
        dispatch({ type: "ENCOUNTER_CHOICE", choice: 2, outcomeRoll: Math.random() });
        return;
      }

      if (key.name === "3") {
        dispatch({ type: "ENCOUNTER_CHOICE", choice: 3, outcomeRoll: Math.random() });
      }
    }
  });

  return (
    <box width="100%" height="100%" backgroundColor="#0f172a">
      <Show when={dimensions().width < 80 || dimensions().height < 24} fallback={
        <Switch fallback={<MarketScreen selectedDrug={selectedDrug()} modal={modal()} />}>
          <Match when={state.screen === "title"}>
            <TitleScreen />
          </Match>
          <Match when={state.screen === "market"}>
            <MarketScreen selectedDrug={selectedDrug()} modal={modal()} />
          </Match>
          <Match when={state.screen === "travel"}>
            <TravelScreen selectedCity={selectedCity()} />
          </Match>
          <Match when={state.screen === "encounter"}>
            <EncounterScreen />
          </Match>
          <Match when={state.screen === "game_over"}>
            <GameOverScreen />
          </Match>
        </Switch>
      }>
        <box flexDirection="column" alignItems="center" justifyContent="center" width="100%" height="100%">
          <text fg="#f8fafc">
            <strong>Terminal too small</strong>
          </text>
          <text fg="#cbd5e1">Resize to at least 80x24.</text>
        </box>
      </Show>

      <Show when={quitState() === "confirm"}>
        <box position="absolute" left={18} top={8} width={42} border borderStyle="double" padding={1} backgroundColor="#111827">
          <text fg="#f8fafc"><strong>Quit game?</strong></text>
          <text fg="#cbd5e1">Press Y to quit, N to continue.</text>
        </box>
      </Show>
    </box>
  );
}
