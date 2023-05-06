// sqlite table for persisting listings locations
// current db - stores current(newly added) locations
// previous db - after comparing current location db
// with previous db locations, all the content from
// current is moved to previous, current db is cleared
// to empty memory

import * as SQLite from 'expo-sqlite';


const databaseP = SQLite.openDatabase('previous.db');
const database = SQLite.openDatabase('current.db');

// previous db init
export function initp() {
  const promise = new Promise((resolve, reject) => {
    databaseP.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS previous (
          pk INTEGER PRIMARY KEY NOT NULL,
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


// current db init
export function initc() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS current (
          pk INTEGER PRIMARY KEY NOT NULL,
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


export function insertCurrentSearch(id, location) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `INSERT INTO current (location) VALUES (?)`,
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
export function readCurrentSearch() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `SELECT * FROM current`,
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

export function removeCurrentSearch(id) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `DELETE FROM current WHERE (id) = (?)`,
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


// function to copy data from one table to other

// function to clean table

// function to compare tables