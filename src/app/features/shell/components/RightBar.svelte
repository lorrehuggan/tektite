<script lang="ts">
  import { layoutState } from "@/lib/stores/layout.svelte";
</script>

<div
  class="border-border-muted bg-surface-0 border-l-[1px] p-2"
  style:width={layoutState.rightSidebarCollapsed ? "60px" : "280px"}
>
  <!-- <p>Right Bar</p> -->
</div>
