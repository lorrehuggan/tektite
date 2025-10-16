<script>
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

  import AppShell from "@/features/shell/screens/AppShell.svelte";
  import "@/styles/root.css";

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <AppShell />
  <slot />
  <SvelteQueryDevtools />
</QueryClientProvider>
