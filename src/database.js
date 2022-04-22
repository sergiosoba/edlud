import { connect } from "mongoose";
import { MONGODB_URI } from "./config";
var cron = require("node-cron");

(async () => {
  try {
    const db = await connect(MONGODB_URI);
    console.log("DB connected to", db.connection.name);

    // HEROKU
    cron.schedule("*/25 * * * *", () => {
      const collections = db.connection.collections;
      console.log(collections);
    });
  } catch (error) {
    console.log(error);
  }
})();
