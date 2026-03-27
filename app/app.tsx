import { generatePrices } from "./lib/random";
import { GameProvider } from "./lib/use-game";
import { AppShell } from "./screens/app-shell";

export function App() {
  return (
    <GameProvider initialPrices={generatePrices()}>
      <AppShell />
    </GameProvider>
  );
}
