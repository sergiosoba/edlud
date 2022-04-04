import { PORT } from "./config";
import app from "./app";
import "./database";

app.listen(PORT);
console.log("Server on port", PORT);

var cron = require("node-cron");
cron.schedule("*/25 * * * *", () => {
  console.log("LIVE");
});
