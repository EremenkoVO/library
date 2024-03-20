import db from './Database';

/**
 * Получение всех книг из базы
 */
export async function getAllBooksDB() {
  return db.select('select * from Books');
}

/**
 * Добавление книги
 */
export async function addBookDB({
  author,
  name,
  description,
  year,
  cover,
  isCheck,
  path,
  category,
  tags,
  created,
}) {
  return await db.execute(
    `insert into Books (
        author,
        name,
        description,
        year,
        cover,
        isCheck,
        path,
        id_category,
        tags,
        created
  ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      author,
      name,
      description,
      year,
      cover,
      isCheck ? 1 : 0,
      path,
      category,
      JSON.stringify(tags),
      created,
    ],
  );
}

/**
 * Обновление информации о книге
 */
export async function updateBookDB({
  id,
  author,
  name,
  description,
  year,
  cover,
  isCheck,
  path,
  category,
  tags,
}) {
  return await db.execute(
    `update Books set author=$1, name=$2, description=$3, year=$4, cover=$5, isCheck=$6, path=$7, id_category=$8, tags=$9 where id=$10`,
    [author, name, description, year, cover, isCheck, path, category, tags, id],
  );
}

/**
 * Удаление книги
 */
export async function deleteBookByIdDB(id) {
  return await db.execute('delete from Books where id=$1', [id]);
}
