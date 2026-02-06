import express from 'express';
import Database from 'better-sqlite3';

const db = new Database('favorites.db');

const router = express.Router();

// Routing -- use this to see if it is hitting the database

// router.use((req, res, next) => {
//   console.log('Favorites hit');
//   next();
// });

// Middleware
// Used to do mini service before hitting server e.g. logging/authentication/etc.
// needs to invoke next to continue to the next thing
// app.use((req, res, next) => {
//   console.log('hit 1');
//   next();
// });

// app.use((req, res, next) => {
//   console.log('hit 2');
//   next();
// });

// Add middleware to another method

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
router.get('/', (req, res) => {
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

  // Return not needed as this acts like a return
  res.json({ favorites });
});

// Handler for POST method
router.post('/', (req, res) => {
  const { name, url } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }

  if (!url) {
    return res.status(400).json({ error: 'Url required' });
  }

  const result = db
    .prepare('INSERT INTO favorites (name, url) VALUES (?, ?)')
    .run(name, url);

  res.status(201).json({ id: result.lastInsertRowid });
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const result = db.prepare('DELETE FROM favorites WHERE id = ?').run(id);

  if (!result.changes) {
    return res.status(404).json({ error: 'Favorite not found' });
  }
  res.sendStatus(200);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, url } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name required' });
  }

  if (!url) {
    return res.status(400).json({ error: 'url required' });
  }

  const result = db
    .prepare('UPDATE favorites SET name=?, url=? WHERE id=? ')
    .run(name, url, id);

  if (!result.changes) {
    return res.status(404).json({ error: 'Favorite not found' });
  }

  res.sendStatus(200);
});

router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, url } = req.body;

  if (!name && !url) {
    return res.status(400).json({ error: 'Name or URL required' });
  }

  //Code below goes to the database twice, all commented code is no longer needed if we use COALESCE
  // If i pass a new name or url using req.body, use that value. Otherwise, keep the value already in table

  // const favorite = db.prepare('SELECT * FROM favorites WHERE id=?').get(id);

  // if (!favorite) {
  //   return res.status(404).json({ error: 'Favorite not found' });
  // }

  // const newName = name || favorite.name;
  // const newUrl = url || favorite.url;

  const result = db
    .prepare(
      'UPDATE favorites SET name=COALESCE(?, name), url=COALESCE(?, url) WHERE id=?',
    )
    .run(name, url, id);

  if (!result.changes) {
    return res.status(400).json({ error: 'Favorite not found' });
  }

  res.sendStatus(200);
});

// GET method with id
router.get('/:id', (req, res, next) => {
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

export default router;
