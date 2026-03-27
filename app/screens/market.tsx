import { For, Show } from "solid-js";
import { DRUG_BASE_PRICES, DRUGS } from "../game/constants";
import { selectCurrentPrices, selectInventoryCount, selectInventoryValue, selectMaxAffordable, selectMaxSellable, selectPriceIndicator } from "../game/selectors";
import type { Drug } from "../game/types";
import { useGame } from "../lib/use-game";

function renderBar(value: number, max: number, width = 18) {
  const ratio = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max));
  const filled = Math.round(ratio * width);
  return `█`.repeat(filled) + `░`.repeat(Math.max(0, width - filled));
}

export interface TransactionModalState {
  kind: "buy" | "sell" | "pay";
  input: string;
  error?: string;
}

export interface MarketScreenProps {
  selectedDrug: Drug;
  modal: TransactionModalState | null;
}

export function MarketScreen(props: MarketScreenProps) {
  const { state } = useGame();
  const currentPrices = () => selectCurrentPrices(state);
  const inventoryCount = () => selectInventoryCount(state);
  const inventoryValue = () => selectInventoryValue(state);

  return (
    <box flexDirection="column" gap={1} padding={1} width="100%" height="100%" backgroundColor="#0f172a">
      <box border borderStyle="double" paddingX={2} paddingY={1} backgroundColor="#111827">
        <box flexDirection="row" justifyContent="space-between" gap={2}>
          <text fg="#f8fafc">
            <strong>ENDS</strong> market — day {state.day}/{state.maxDays}
          </text>
          <text fg="#94a3b8">{state.currentCity}</text>
        </box>
        <box flexDirection="row" justifyContent="space-between" gap={2}>
          <text fg="#34d399">Cash £{state.cash}</text>
          <text fg="#fca5a5">Debt £{state.debt}</text>
          <text fg="#cbd5e1">Inventory {inventoryCount()}/{state.inventoryCapacity}</text>
          <text fg="#fde68a">Worth £{state.cash - state.debt + inventoryValue()}</text>
        </box>
        <box flexDirection="row" gap={2} alignItems="center">
          <text fg="#94a3b8">Health</text>
          <text fg="#86efac">{renderBar(state.health, state.maxHealth)}</text>
          <text fg="#cbd5e1">{state.health}/{state.maxHealth}</text>
        </box>
      </box>

      <box flexDirection="row" gap={1} flexGrow={1}>
        <box border borderStyle="rounded" padding={1} flexGrow={2} flexDirection="column" backgroundColor="#111827">
          <text fg="#f8fafc">
            <strong>Prices</strong>
          </text>
          <For each={DRUGS}>
            {(drug) => {
              const indicator = selectPriceIndicator(state, drug);
              const currentPrice = currentPrices()[drug];
              const delta = currentPrice - DRUG_BASE_PRICES[drug];
              const symbol = indicator === "up" ? "▲" : indicator === "down" ? "▼" : "•";
              const tone = indicator === "up" ? "#fca5a5" : indicator === "down" ? "#86efac" : "#cbd5e1";
              const selected = () => props.selectedDrug === drug;

              return (
                <box flexDirection="row" justifyContent="space-between" backgroundColor={selected() ? "#1e293b" : "transparent"}>
                  <text fg={selected() ? "#f8fafc" : "#e2e8f0"}>{selected() ? "➤ " : "  "}{drug}</text>
                  <box flexDirection="row">
                    <text fg={tone}>{symbol} £{currentPrice}</text>
                    <text fg="#64748b"> ({delta >= 0 ? "+" : ""}{delta})</text>
                  </box>
                </box>
              );
            }}
          </For>
        </box>

        <box border borderStyle="rounded" padding={1} flexGrow={1} flexDirection="column" backgroundColor="#111827">
          <text fg="#f8fafc">
            <strong>Inventory</strong>
          </text>
          <Show when={inventoryCount() === 0}>
            <text fg="#64748b">No stash yet.</text>
          </Show>
          <For each={DRUGS}>
            {(drug) => (
              <box flexDirection="row" justifyContent="space-between">
                <text fg="#e2e8f0">{drug}</text>
                <text fg="#cbd5e1">x{state.inventory[drug]} / {selectMaxSellable(state, drug)}</text>
              </box>
            )}
          </For>
        </box>

        <box border borderStyle="rounded" padding={1} flexGrow={1} flexDirection="column" backgroundColor="#111827">
          <text fg="#f8fafc">
            <strong>Log</strong>
          </text>
          <For each={state.messageLog.slice(-4)}>
            {(message) => <text fg="#cbd5e1">• {message}</text>}
          </For>
          {state.messageLog.length === 0 ? (
            <text fg="#64748b">No messages yet.</text>
          ) : null}
        </box>
      </box>

      <box border borderStyle="single" paddingX={2} paddingY={1} backgroundColor="#020617">
        <text fg="#fbbf24">B</text><text fg="#cbd5e1">uy</text>
        <text fg="#64748b">  ·  </text>
        <text fg="#fbbf24">S</text><text fg="#cbd5e1">ell</text>
        <text fg="#64748b">  ·  </text>
        <text fg="#fbbf24">T</text><text fg="#cbd5e1">ravel</text>
        <text fg="#64748b">  ·  </text>
        <text fg="#fbbf24">P</text><text fg="#cbd5e1">ay debt</text>
        <text fg="#64748b">  ·  </text>
        <text fg="#fbbf24">Q</text><text fg="#cbd5e1">uit</text>
      </box>

      <Show when={props.modal}>
        {(modal: () => TransactionModalState) => {
          const selectedPrice = currentPrices()[props.selectedDrug];
          const maxAffordable = selectMaxAffordable(state, props.selectedDrug);
          const maxSellable = selectMaxSellable(state, props.selectedDrug);

          return (
            <box position="absolute" left={20} top={8} width={44} border borderStyle="double" padding={1} backgroundColor="#111827">
              <text fg="#f8fafc">
                <strong>
                  {modal().kind === "buy" ? "Buy" : modal().kind === "sell" ? "Sell" : "Pay debt"}
                </strong>
              </text>
              <text fg="#cbd5e1">
                {modal().kind === "pay" ? `Debt £${state.debt}` : `${props.selectedDrug} @ £${selectedPrice}`}
              </text>
              <text fg="#94a3b8">
                {modal().kind === "buy"
                  ? `Max affordable: ${maxAffordable}`
                  : modal().kind === "sell"
                    ? `Max sellable: ${maxSellable}`
                    : `Current cash: £${state.cash}`}
              </text>
              <text fg="#f8fafc">Amount: {modal().input || "_"}</text>
              <Show when={modal().error}>
                {(error: () => string) => <text fg="#fca5a5">{error()}</text>}
              </Show>
              <text fg="#64748b">Enter confirms · Esc cancels</text>
            </box>
          );
        }}
      </Show>
    </box>
  );
}
