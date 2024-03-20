import db from './Database';

/**
 * Получить все категории
 */
export async function getAllCategoryDB() {
  return await db.select('select * from Category');
}

/**
 * Добавить категорию
 */
export async function addCategoryDB({ name, id_parent }) {
  return await db.execute(
    `insert into category (name, id_parent) values (?, ?)`,
    [name, id_parent],
  );
}

/**
 * Обновление категории
 */
export async function updateCategoryDB({ id, name, id_parent }) {
  return await db.execute(
    `update Category set name=$1, id_parent=$2 where id=$3`,
    [name, id_parent, id],
  );
}

/**
 * Удалить категорию
 */
export async function removeCategoryDB(id) {
  return await db.execute(`delete from Category where id=$1`, [id]);
}
