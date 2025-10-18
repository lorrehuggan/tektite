<script lang="ts">
  import { onMount } from "svelte";

  import { registerKeybinds } from "@/lib/keybinds/manager";

  import Container from "../components/Container.svelte";
  import LeftBar from "../components/LeftBar.svelte";
  import Main from "../components/Main.svelte";
  import RightBar from "../components/RightBar.svelte";
  import StatusBar from "../components/StatusBar.svelte";
  import TitleBar from "../components/TitleBar.svelte";

  onMount(() => {
    registerKeybinds();
  });
</script>

<div>
  <TitleBar />
  <Container>
    <LeftBar />
    <Main />
    <RightBar />
  </Container>
  <StatusBar />
</div>
