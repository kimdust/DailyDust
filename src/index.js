import { ColorModeScript } from "@chakra-ui/react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/css/app.css";

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <>
    <ColorModeScript />
    <App />
  </>
);
