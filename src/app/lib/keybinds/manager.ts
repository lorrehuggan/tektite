import { Window } from "@tauri-apps/api/window";
import { PressedKeys } from "runed";

import { layoutActions } from "../stores/layout.svelte";

const appWindow = new Window("main");

type Keybind = {
  key: string | string[];
  action: () => void;
};

const keys = new PressedKeys();
const keybinds: Keybind[] = [
  {
    // Toggle left sidebar
    key: ["Control", "b"],
    action: () => {
      if (keys.has("Shift")) return;
      layoutActions.toggleLeftSidebar();
    },
  },
  {
    // Toggle right sidebar
    key: ["Control", "Shift", "b"],
    action: () => layoutActions.toggleRightSidebar(),
  },
  {
    key: ["Control", "Enter"],
    action: () => {
      appWindow.toggleMaximize();
    },
  },
];

export const registerKeybinds = () => {
  keybinds.forEach(({ key, action }) => {
    keys.onKeys(key, action);
  });
};
