<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";

  import { layoutState } from "@/lib/stores/layout.svelte";
  import { FileApi } from "@/lib/utils/file";

  const listNotes = createQuery(() => ({
    queryKey: ["list-notes"],
    queryFn: () => FileApi.listNotes("/home/jacob/Documents"),
  }));
</script>

<div
  class="border-border-muted bg-surface-0 border-r-[1px] p-2"
  style:width={layoutState.leftSidebarCollapsed ? "60px" : "280px"}
  class:collapsed={layoutState.leftSidebarCollapsed}
>
  <!-- <p>Left Bar</p> -->
  <div>
    {#if listNotes.isLoading}
      <p>Loading...</p>
    {:else if listNotes.isError}
      <p>Error: listNotes.error.message}</p>
    {:else if listNotes.isSuccess}
      {#each listNotes.data as note (note.path)}
        <p>{note.path}</p>
      {/each}
    {/if}
  </div>
</div>
