<script lang="ts">
  import { layoutState } from "@/lib/stores/layout.svelte";
</script>

<div
  class="border-border-muted bg-surface-0 border-r-[1px] p-2"
  style:width={layoutState.leftSidebarCollapsed ? "60px" : "280px"}
>
  <div class="text-xs"></div>
</div>
