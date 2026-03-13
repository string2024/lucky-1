import { createRoot } from "react-dom/client";
import { init } from "@apps-in-toss/web-framework";
import App from "./App.tsx";
import "./index.css";

init();

createRoot(document.getElementById("root")!).render(<App />);
