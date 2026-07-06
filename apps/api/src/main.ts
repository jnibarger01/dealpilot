import { createMvpApplication } from "./application.js";
import { createHttpServer } from "./server.js";

const app = createMvpApplication();
const server = createHttpServer(app);
const portText = process.env.DEALPILOT_PORT ?? "4317";
const port = Number.parseInt(portText, 10);
server.listen(port, "127.0.0.1", () => {
  console.log(`DealPilot MVP API listening on http://127.0.0.1:${port}`);
});
