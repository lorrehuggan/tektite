<script>
  import { FolderTree, MagnetIcon, SearchCheckIcon } from "lucide-svelte";

  import Button from "@/components/ui/Button.svelte";
  import { layoutActions, layoutState } from "@/lib/stores/layout.svelte";
</script>

<div
  class="border-border-muted flex h-[30px] w-screen items-center border-t-[1px] p-2"
>
  <Button intent="status" onclick={() => layoutActions.toggleLeftSidebar()}>
    <FolderTree
      size={16}
      strokeWidth={1}
      absoluteStrokeWidth
      class={!layoutState.leftSidebarCollapsed ? "text-brand" : "text-text"}
    />
  </Button>
  <Button intent="status">
    <MagnetIcon size={16} strokeWidth={1} absoluteStrokeWidth />
  </Button>
  <Button intent="status" disabled>
    <SearchCheckIcon size={20} strokeWidth={1} absoluteStrokeWidth />
  </Button>
</div>
