import db from './Database';

/**
 * Инициализация базы данных
 */
export default async function initDB() {
  /**
   * Создание таблицы каталогов
   */
  await db.execute(`create table if not exists Category(
    "id"	INTEGER NOT NULL UNIQUE,
    "name"	TEXT,
    "id_parent"	INTEGER,
    PRIMARY KEY("id" AUTOINCREMENT)
  );`);

  /**
   *
   */
  await db.execute(
    `create table if not exists Books (
    "id"	INTEGER NOT NULL UNIQUE,
    "author"	TEXT,
    "name"	TEXT,
    "description"	TEXT,
    "cover"	TEXT,
    "isCheck"	INTEGER,
    "path"	TEXT,
    "id_category"	INTEGER,
    "tags"	TEXT,
    "created"	TEXT,
    FOREIGN KEY("id_category") REFERENCES Category(id),
    PRIMARY KEY("id" AUTOINCREMENT)
  );`,
  );
}

export async function deleteTables() {
  await db.execute('drop table Category');
  await db.execute('drop table Books');
}
