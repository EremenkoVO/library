import Database from 'tauri-plugin-sql-api';

let libraryDB =
  process.env.NODE_ENV === 'development'
    ? 'sqlite:library_test.db'
    : 'sqlite:library.db';

const db = await Database.load(libraryDB);

export default db;
