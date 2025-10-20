<script lang="ts">
  import { animate } from "motion";
  import { watch } from "runed";

  import { layoutState } from "@/lib/stores/layout.svelte";

  let rightBarElement: HTMLDivElement;

  watch(
    () => layoutState.rightSidebarCollapsed,
    () => {
      if (layoutState.rightSidebarCollapsed) {
        animate(
          rightBarElement,
          { width: "0px", opacity: 0 },
          { duration: 0.1, ease: "easeOut" }
        );
      } else {
        animate(
          rightBarElement,
          { width: "280px", opacity: 1 },
          { duration: 0.1, ease: "easeOut" }
        );
      }
    }
  );
</script>

<div
  bind:this={rightBarElement}
  class="border-border-muted bg-surface-0 border-l-[1px]"
  style:width={layoutState.rightSidebarCollapsed ? "0px" : "280px"}
>
  <!-- <p>Right Bar</p> -->
</div>
