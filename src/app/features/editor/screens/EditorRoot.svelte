<script lang="ts">
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import { onDestroy, onMount } from "svelte";

  let element = $state<HTMLDivElement>();
  let editorState = $state<{ editor: Editor | null }>({ editor: null });

  onMount(() => {
    editorState.editor = new Editor({
      element,
      extensions: [StarterKit],
      autofocus: true,
      onTransaction: ({ editor }) => {
        editorState = { editor };
      },
    });
  });

  onDestroy(() => {
    editorState.editor?.destroy();
  });
</script>

<div bind:this={element} class="prose prose-invert max-w-none"></div>
