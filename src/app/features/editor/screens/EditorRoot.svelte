<script lang="ts">
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import { onDestroy, onMount } from "svelte";

  let element = $state<HTMLElement>();
  let editorState = $state<{ editor: Editor | null }>({ editor: null });

  onMount(() => {
    editorState.editor = new Editor({
      element,
      extensions: [StarterKit],
      content: "<p>Hello World</p>",
      onTransaction: ({ editor }) => {
        editorState = { editor };
      },
    });
  });

  onDestroy(() => {
    editorState.editor?.destroy();
  });
</script>

<div
  bind:this={element}
  class="prose prose-invert prose-p:text-sm max-w-none"
></div>
