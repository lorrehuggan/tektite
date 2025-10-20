<script lang="ts">
  import { animate } from "motion";
  import { watch } from "runed";

  import { layoutState } from "@/lib/stores/layout.svelte";

  let leftBarElement: HTMLDivElement;

  watch(
    () => layoutState.leftSidebarCollapsed,
    () => {
      if (layoutState.leftSidebarCollapsed) {
        animate(
          leftBarElement,
          { width: "0px", opacity: 0 },
          { duration: 0.1, ease: "easeOut" }
        );
      } else {
        animate(
          leftBarElement,
          { width: "280px", opacity: 1 },
          { duration: 0.1, ease: "easeOut" }
        );
      }
    }
  );
</script>

<div
  bind:this={leftBarElement}
  class="bg-surface-0 border-border-muted border-r-[1px]"
>
  <div class="text-xs"></div>
</div>
