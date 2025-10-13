<script>
  import { Window } from "@tauri-apps/api/window";

  import CloseIcon from "@/components/icons/CloseIcon.svelte";
  import MinusIcon from "@/components/icons/MinusIcon.svelte";

  const appWindow = new Window("main");
</script>

<div data-tauri-drag-region class="titlebar px-2">
  <div>
    <p class="uppercase">tektite</p>
  </div>
  <div class="flex items-center gap-2">
    <button onclick={() => appWindow.minimize()}>
      <MinusIcon />
    </button>
    <button onclick={() => appWindow.close()}>
      <CloseIcon />
    </button>
  </div>
</div>

<style>
  .titlebar {
    height: 30px;
    background: var(--color-surface-1);
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
