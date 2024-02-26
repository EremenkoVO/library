import Database from 'tauri-plugin-sql-api';

const db = await Database.load('sqlite:library.db');

export default db;
