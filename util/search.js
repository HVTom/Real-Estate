// sqlite table for persisting saved searches

import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('search.db');

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS search (
          pk INTEGER PRIMARY KEY NOT NULL,
          id INTEGER NOT NULL,
          location TEXT NOT NULL
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


export function insertSavedSearch(id, location) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `INSERT INTO search (id, location) VALUES (?, ?)`,
        [id, location],
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
export function readSavedSearch() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `SELECT * FROM search`,
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

export function removeSavedSearch(id) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `DELETE FROM search WHERE (id) = (?)`,
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
