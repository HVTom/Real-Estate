//app-wide favorite ads state
import React, { createContext, useState, useEffect } from "react";
import { insertFavorite, readFavorite, removeFavorite } from "../util/persistence";



export const FavoriteContext = createContext({
  ids: [],
  addFavoriteAd: (id) => {},
  removeFavoriteAd: (id) => {},
});


const insertToDb = async (id) => {
  await insertFavorite(id);
}


const removeFromDb = async (id) => {
  await removeFavorite(id);
}


function FavoriteContextProvider({ children }) {
  const [favoriteAdIds, setFavoriteAdIds] = useState([]);

  // IDS FROM favoriteAdIds ARE STRINGS
  useEffect(() => {
    async function fetchFromDb() { // FETCH FROM DB TO FILL STATE
      const response = await readFavorite();
      const responseIdsArray = response.rows._array;
      console.log('responseIdsArray: ', responseIdsArray);
      const favIds = [];
      for (let objIds in responseIdsArray) {
        favIds.push((responseIdsArray[objIds].id).toString());
      }
      console.log("favAdsIds arr: ", favIds);
      setFavoriteAdIds(favIds);
    }
    fetchFromDb();
  }, []);


  function addFavoriteAd(id) {
    setFavoriteAdIds((currentFavoriteIds) => [...currentFavoriteIds, id]);
    // WRITE TO DB
    insertToDb(id);
  }

  function removeFavoriteAd(id) {
    setFavoriteAdIds((currentFavoriteIds) =>
      currentFavoriteIds.filter((estateId) => estateId !== id)
    );
    // DELETE FROM DB
    removeFromDb(id);
  }


  const value = {
    ids: favoriteAdIds, // try using async storage get item as ids array
    addFavoriteAd: addFavoriteAd,
    removeFavoriteAd: removeFavoriteAd,
  };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}


export default FavoriteContextProvider;