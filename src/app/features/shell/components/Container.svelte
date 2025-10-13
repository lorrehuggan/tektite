<script>
  const { children } = $props();
</script>

<div class="appshell">
  {@render children()}
</div>

<style>
  .appshell {
    display: grid;
    grid-template-areas:
      "left-sidebar main-content right-sidebar"
      "status-bar status-bar status-bar";
    grid-template-rows: 1fr 28px;
    grid-template-columns: 280px 1fr 280px;
    width: 100vw;
    height: calc(100vh - 30px);
    margin-top: 30px;
    overflow: hidden;
  }
</style>
