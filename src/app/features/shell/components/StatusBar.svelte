<script>
  import { FolderTree, MagnetIcon, SearchCheckIcon } from "lucide-svelte";

  import { layoutActions, layoutState } from "@/lib/stores/layout.svelte";
</script>

<div
  class="border-border-muted flex h-[30px] w-screen items-center border-t-[1px] p-2"
>
  <button
    class="hover:bg-surface-2 p-1"
    onclick={() => layoutActions.toggleLeftSidebar()}
  >
    <FolderTree
      size={16}
      strokeWidth={1}
      absoluteStrokeWidth
      class={!layoutState.leftSidebarCollapsed ? "text-brand" : "text-text"}
    />
  </button>
  <button
    class="hover:bg-surface-2 p-1"
    onclick={() => layoutActions.toggleLeftSidebar()}
  >
    <MagnetIcon size={16} strokeWidth={1} absoluteStrokeWidth />
  </button>
  <button
    class="hover:bg-surface-2 p-1"
    onclick={() => layoutActions.toggleLeftSidebar()}
  >
    <SearchCheckIcon size={20} strokeWidth={1} absoluteStrokeWidth />
  </button>
</div>
