import Database from 'better-sqlite3';
const db = new Database('favorites.db');

const createTable = `
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL
    )
`;

db.exec(createTable);

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

const insertData = db.prepare(
  'INSERT INTO favorites (name, url) VALUES (?, ?)',
);

favorites.forEach((fav) => {
  insertData.run(fav.name, fav.url);
});

db.close();
