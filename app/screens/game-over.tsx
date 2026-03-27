import { useGame } from "../lib/use-game";
import { getEndingFlavor, selectInventoryValue, selectNetWorth } from "../game/selectors";

export function GameOverScreen() {
  const { state } = useGame();
  const deathEnding = () => state.health <= 0;
  const netWorth = () => selectNetWorth(state);
  const inventoryValue = () => selectInventoryValue(state);

  return (
    <box flexDirection="column" gap={1} padding={2} width="100%" height="100%" backgroundColor="#0f172a">
      <text fg="#f8fafc">
        <strong>Game Over</strong>
      </text>
      <text fg="#cbd5e1">{deathEnding() ? "You didn't make it." : "You made it to the end."}</text>
      <box border borderStyle="rounded" padding={1} flexDirection="column" backgroundColor="#111827">
        <text fg="#e2e8f0">Days survived: {state.day}</text>
        <text fg="#e2e8f0">Final cash: £{state.cash}</text>
        <text fg="#e2e8f0">Final debt: {state.debt > 0 ? `£${state.debt}` : "No debt"}</text>
        <text fg="#e2e8f0">Inventory value: £{inventoryValue()}</text>
        <text fg="#fbbf24">Net worth: £{netWorth()}</text>
        <text fg="#86efac">Ending tier: {getEndingFlavor(state)}</text>
      </box>
      <text fg="#94a3b8">Press N for a new run or Q to quit.</text>
    </box>
  );
}
