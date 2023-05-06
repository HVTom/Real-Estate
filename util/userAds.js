// sqlite table for persisting user posted ads

import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('userAds.db');

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS userAds (
          pk INTEGER PRIMARY KEY NOT NULL,
          id INTEGER NOT NULL,
          title TEXT NOT NULL,
          price INTEGER NOT NULL,
          surface INTEGER NOT NULL,
          bedrooms INTEGER,
          bathrooms INTEGER,
          type TEXT NOT NULL,
          transx TEXT NOT NULL,
          year_built INTEGER NOT NULL,
          description TEXT NOT NULL,
          location TEXT NOT NULL,
          phone INTEGER NOT NULL,
          email TEXT NOT NULL,
          image TEXT NOT NULL
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


export function insertUserAds(id, title, price, surface, bedrooms, bathrooms, type, transx, year_built, description, location, phone, email, image) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `INSERT INTO userAds (
          id, title, price, surface, bedrooms, bathrooms, type, transx, year_built, description, location, phone, email, image) 
          VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, title, price, surface, bedrooms, bathrooms, type, transx, year_built, description, location, phone, email, image],
        (_, result) => {
          //console.log(result);
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
export function readUserAds() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `SELECT * FROM userAds`,
        [],
        (_, result) => {
          //console.log(JSON.stringify(result));
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

export function removeUserAd(id) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((transObj) => {
      transObj.executeSql(
        `DELETE FROM userAds WHERE (id) = (?)`,
        [id],
        (_, result) => {
          //console.log(result);
          resolve(result);
        },
        (_, error) => {
          reject(error);
        });
    });
  })
  return promise
}
