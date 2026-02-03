import express from 'express';
import Database from 'better-sqlite3';

const db = new Database('favorite.db');
const app = express();
const port = 3000;

// Middleware
// Used to do mini service before hitting server e.g. logging/authentication/etc.
// needs to invoke next to continue to the next thing
app.use((req, res, next) => {
  console.log('hit 1');
  next();
});

app.use((req, res, next) => {
  console.log('hit 2');
  next();
});

// Add midware to another method

// app.get('/favorites', (req, res, next) => {
//   console.log('Pre processing...');
//   next();
// });

//OR

// const authenticate = (req, res, next) => {
//   console.log('Pre processing...');
//   next();
// };

// Handler for GET method
// Add authenticate in parameter to use in that way
app.get('/favorites', (req, res) => {
  let query = 'SELECT * FROM favorites';
  const sort = req.query.sort;

  if (sort === 'asc') {
    query += ' ORDER BY name ASC';
  } else if (sort === 'desc') {
    query += ' ORDER BY name DESC';
  }

  const favorites = db.prepare(query).all();
  // When you have a property name with the same name as data, you can leave it blank
  // res.json({ favorites: favorites });

  res.json({ favorites });
});

// GET method with id
app.get('/favorites/:id', (req, res, next) => {
  // try {
  // Grab id from url request
  const id = parseInt(req.params.id);

  // Check if id matches any id in favorites array (iterates through all of them to find the first match)
  // Return favorites object if found to var favorite
  const favorite = db.prepare('SELECT * FROM favorites WHERE id = ?').get(id);

  if (!favorite) {
    // return is needed here to fix CANNOT SET HEADERS AFTER THEY ARE SENT TO THE CLIENT issue
    // without return here, it wants to run the res.json({ favorite }) line beneath which sends another response to the user, thus changing the header
    // return is the fix (last json item we will return) OR encapsulate the last line in an else {} -- just dont have them both run
    return res.status(404).json({ error: 'Favorite not found' });
  }

  // Like to enclose this with brackets to add a favorite id in front of the object
  res.json({ favorite });

  // Part of try catch block - useful if you want middle ware in this function as well for whatever reason

  // } catch (err) {
  //   console.log('CUSTOM TO THIS ROUTE');
  //   next(err);
  // }
});

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
