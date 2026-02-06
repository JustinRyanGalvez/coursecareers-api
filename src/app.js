import express from 'express';
import Database from 'better-sqlite3';
import favorites from './routes/favorites.js';
import { eq } from 'semver';

const db = new Database('favorites.db');
const app = express();

// Adjusts middleware to take incoming request bodies
app.use(express.json());
const port = 3000;

// Sets path of /favorites to router in favorites.js file
app.use('/favorites', favorites);

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

  if (err.name === 'SqliteError') {
    console.log('db error hit!');
  }

  // Can end middleware pipeline using something like

  // res.status(500).json({ error: 'Something went wrong, try again later' });

  // Or continue using
  next(err);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}...`);
});
