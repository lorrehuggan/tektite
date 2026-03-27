import "@opentui/solid/runtime-plugin-support";
import { render } from "@opentui/solid";

const App = () => {
  return (
    <box border padding={1} borderColor={"#ffffff"} width={50}>
      <text>Hello, World!</text>
    </box>
  );
};

render(App);
