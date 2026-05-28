import express from "express";
import Database from "better-sqlite3";
import favorites from "./routes/favorites.js";
import { eq } from "semver";
import cors from "cors";
const db = new Database("favorites.db");
const app = express();
const port = 3000;
const frontEndUrl = "http://localhost:3001";
// If ever needed, currently not in use as of 5/1/26
const frontEndUrl2 = "http://localhost:3002";
// Adjusts middleware to take incoming request bodies
app.use(express.json());
// Fulfills CORS requirement
app.use(
  cors({
    origin: [frontEndUrl, frontEndUrl2],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Accept"],
  }),
);
// Sets path of /favorites to router in favorites.js file
app.use("/favorites", favorites);
// Routing -- use this to see if its hitting the main route
// app.use((req, res, next) => {
//   console.log('Main routes');
//   next();
// });
// app.get('/', (req, res) => {
//   res.json({ hello: 'world' });
// });
// Middleware - error checking goes at the bottom/last typically
app.use((err, req, res, next) => {
  // console.log(err);
  // Can check for specific error
  if (err.name === "SqliteError") {
    console.log("db error hit!");
  }
  // Can end middleware pipeline using something like
  // res.status(500).json({ error: 'Something went wrong, try again later' });
  // Or continue using
  next(err);
});
app.listen(port, () => {
  console.log(`http://localhost:${port}/favorites...`);
});
//# sourceMappingURL=app.js.map
