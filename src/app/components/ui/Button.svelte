<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { type VariantProps, tv } from "tailwind-variants";

  const button = tv({
    base: "cursor-pointer",
    variants: {
      intent: {
        status: "hover:bg-surface-2 p-1",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
  });

  type ButtonVariants = VariantProps<typeof button>;

  interface Props
    extends ButtonVariants,
      Omit<HTMLButtonAttributes, "disabled"> {
    children: Snippet;
  }
  const { disabled, intent, children, ...rest }: Props = $props();

  const classes = $derived(button({ intent, disabled }));
</script>

<button {...rest} class={classes} {disabled}>
  {@render children()}
</button>
