import { For } from "solid-js";
import { CITIES } from "../game/constants";
import type { City } from "../game/types";
import { useGame } from "../lib/use-game";

export interface TravelScreenProps {
  selectedCity: City;
}

export function TravelScreen(props: TravelScreenProps) {
  const { state } = useGame();

  return (
    <box flexDirection="column" gap={1} padding={2} width="100%" height="100%" backgroundColor="#0f172a">
      <text fg="#f8fafc">
        <strong>Travel</strong> — choose your next stop
      </text>
      <text fg="#cbd5e1">Travel advances the day, adds 5% interest, and restores 10 health.</text>
      <text fg="#94a3b8">Current city is locked: {state.currentCity}</text>

      <box border borderStyle="rounded" padding={1} flexDirection="column" backgroundColor="#111827">
        <For each={CITIES}>
          {(city) => {
            const current = city === state.currentCity;
            const selected = city === props.selectedCity;

            return (
              <box flexDirection="row" justifyContent="space-between" backgroundColor={selected ? "#1e293b" : "transparent"}>
                <text fg={current ? "#64748b" : selected ? "#f8fafc" : "#cbd5e1"}>
                  {current ? "✕ " : selected ? "➤ " : "  "}{city}
                </text>
                <text fg={current ? "#64748b" : selected ? "#86efac" : "#64748b"}>
                  {current ? "current" : selected ? "selected" : ""}
                </text>
              </box>
            );
          }}
        </For>
      </box>

      <box border borderStyle="single" paddingX={2} paddingY={1} backgroundColor="#020617">
        <text fg="#fbbf24">↑/↓</text><text fg="#cbd5e1"> move</text>
        <text fg="#64748b">  ·  </text>
        <text fg="#fbbf24">Enter</text><text fg="#cbd5e1"> travel</text>
        <text fg="#64748b">  ·  </text>
        <text fg="#fbbf24">Esc</text><text fg="#cbd5e1"> back</text>
      </box>
    </box>
  );
}
