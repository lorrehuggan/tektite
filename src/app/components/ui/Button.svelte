<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { type VariantProps, tv } from "tailwind-variants";

  const button = tv({
    base: "cursor-pointer",
    variants: {
      color: {
        icon: "hover:bg-surface-1",
      },
      size: {
        iconSmall: "p-1",
        iconMedium: "p-2",
        iconLarge: "p-3",
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
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
      Omit<HTMLButtonAttributes, "disabled" | "color"> {
    children: Snippet;
  }
  const { disabled, color, size, children, ...rest }: Props = $props();

  const classes = $derived(button({ color, size, disabled }));
</script>

<button {...rest} class={classes} {disabled}>
  {@render children()}
</button>
