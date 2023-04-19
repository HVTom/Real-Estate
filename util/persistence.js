// sqlite table for persisting user saved ads


import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('favorites.db');

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS favorites (
          pk INTEGER PRIMARY KEY NOT NULL,
          id INTEGER
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}


export function insertFavorite(id) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `INSERT INTO favorites (id) VALUES (?)`,
        [id],
        (_, result) => {
          console.log(result);
          resolve(result);
        },
        (_, error) => {
          reject(error);
        });
    });
  })
  return promise;
}
//`SELECT DISTINCT id FROM favorites`

export function readFavorite() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `SELECT DISTINCT id FROM favorites`,
        [],
        (_, result) => {
          console.log(JSON.stringify(result));
          resolve(result);
        },
        (_, error) => {
          reject(error);
        });
    });
  })
  return promise
}

//`DELETE FROM favorites WHERE (id) = (?)`

export function removeFavorite(id) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `DELETE FROM favorites WHERE (id) = (?)`,
        [id],
        (_, result) => {
          console.log(result);
          resolve(result);
        },
        (_, error) => {
          reject(error);
        });
    });
  })
  return promise
}
