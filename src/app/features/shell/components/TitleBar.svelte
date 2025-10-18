<script>
  import { Window } from "@tauri-apps/api/window";
  import { Minus, X } from "lucide-svelte";

  const appWindow = new Window("main");
</script>

<div
  data-tauri-drag-region
  class="titlebar border-border-muted border-b-[1px] px-2"
>
  <div>
    <p class="text-xs tracking-wide uppercase">tektite</p>
  </div>
  <div class="flex items-center gap-1">
    <button onclick={() => appWindow.minimize()}>
      <Minus size={20} strokeWidth={1} absoluteStrokeWidth />
    </button>
    <button onclick={() => appWindow.close()}>
      <X size={20} strokeWidth={1} absoluteStrokeWidth />
    </button>
  </div>
</div>

<style>
  .titlebar {
    height: 30px;
    background: var(--color-surface-0);
    user-select: none;
    display: grid;
    grid-template-columns: auto max-content;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
