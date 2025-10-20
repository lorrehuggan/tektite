<script>
  const { children } = $props();
</script>

<div class="appshell mt-[30px] flex w-screen overflow-hidden">
  {@render children()}
</div>

<style>
  .appshell {
    min-height: calc(100vh - 60px);
    display: grid;
    grid-template-columns: 48px auto 1fr auto;
    grid-template-rows: 1fr;
    transition: grid-template-columns 0.25s ease;
  }
</style>
