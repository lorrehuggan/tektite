<script>
  const { children } = $props();
</script>

<div class="appshell mt-[30px] flex w-screen overflow-hidden">
  {@render children()}
</div>

<style>
  .appshell {
    height: calc(100vh - 60px);
  }
</style>
