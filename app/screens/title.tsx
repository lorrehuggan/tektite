import { useGame } from "../lib/use-game";

export function TitleScreen() {
  const { state } = useGame();

  return (
    <box flexDirection="column" alignItems="center" justifyContent="center" gap={1} width="100%" height="100%" padding={2}>
      <box border borderStyle="double" paddingX={4} paddingY={2} backgroundColor="#111827">
        <ascii_font text="ENDS" font="block" color="#f8fafc" />
      </box>
      <text fg="#cbd5e1">
        <strong>Terminal trading game</strong>
      </text>
      <text fg="#94a3b8">Day {state.day} of {state.maxDays}</text>
      <text fg="#fbbf24">Press <strong>N</strong> to start or <strong>Q</strong> to quit.</text>
    </box>
  );
}
