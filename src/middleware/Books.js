import db from './Database';

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

/**
 * Получение всех книг из базы
 */
export async function getAllBooksDB() {
  return db.select('select * from Books');
}

/**
 * Добавление книги
 * @returns
 */
export async function addBookDB({
  author,
  name,
  description,
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
        cover,
        isCheck,
        path,
        id_category,
        tags,
        created
  ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      author,
      name,
      description,
      await toBase64(cover),
      isCheck ? 1 : 0,
      path,
      category,
      JSON.stringify(tags),
      created,
    ],
  );
}

export async function deleteBookByIdDB(id) {
  return await db.execute('delete from Books where id=$1', [id]);
}
