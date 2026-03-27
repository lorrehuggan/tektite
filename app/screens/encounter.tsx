import { For } from "solid-js";
import { useGame } from "../lib/use-game";

export function EncounterScreen() {
  const { state } = useGame();
  const encounter = () => state.activeEncounter;

  return (
    <box flexDirection="column" gap={1} padding={2} width="100%" height="100%" backgroundColor="#0f172a">
      <text fg="#f8fafc">
        <strong>Encounter</strong>
      </text>

      {encounter() ? (
        <>
          <text fg="#cbd5e1">{encounter()!.description}</text>
          <text fg="#94a3b8">{encounter()!.context}</text>
          <box border borderStyle="rounded" padding={1} flexDirection="column" backgroundColor="#111827">
            <For each={encounter()!.choices}>
              {(choice, index) => (
                <text fg="#e2e8f0">
                  {index() + 1}. {choice}
                </text>
              )}
            </For>
          </box>
          <text fg="#64748b">Press 1, 2, or 3 to choose.</text>
        </>
      ) : (
        <text fg="#94a3b8">No active encounter.</text>
      )}
    </box>
  );
}
