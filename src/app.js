import express from 'express';

const app = express();
const port = 3000;

const favorites = [
  {
    id: 1,
    name: 'goog',
    url: 'https://google.com',
  },
  {
    id: 2,
    name: 'social',
    url: 'https://instagram.com',
  },
  {
    id: 3,
    name: 'code',
    url: 'https://leetcode.com',
  },
];

// Handler for GET method
app.get('/favorites', (req, res) => {
  // Rest operator!
  const favoritesCopy = [...favorites];
  const sort = req.query.sort;
  if (sort === 'asc') {
    favoritesCopy.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'desc') {
    favoritesCopy.sort((a, b) => b.name.localeCompare(a.name));
  }
  // When you have a property name with the same name as data, you can leave it blank
  // res.json({ favorites: favorites });

  res.json({ favorites: favoritesCopy });
});

// GET method with id
app.get('/favorites/:id', (req, res) => {
  // Grab id from url request
  const id = parseInt(req.params.id);

  // Check if id matches any id in favorites array (iterates through all of them to find the first match)
  // Return favorites object if found to var favorite
  const favorite = favorites.find((fav) => fav.id == id);

  if (!favorite) {
    // return is needed here to fix CANNOT SET HEADERS AFTER THEY ARE SENT TO THE CLIENT issue
    // without return here, it wants to run the res.json({ favorite }) line beneath which sends another response to the user, thus changing the header
    // return is the fix (last json item we will return) OR encapsulate the last line in an else {} -- just dont have them both run
    return res.status(404).json({ error: 'Favorite not found' });
  }

  // Like to enclose this with brackets to add a favorite id in front of the object
  res.json({ favorite });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}...`);
});
