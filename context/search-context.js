//app-wide favorite searches state
import React, { createContext, useState, useEffect } from "react";
import { insertSavedSearch, readSavedSearch, removeSavedSearch } from "../util/search";



export const SearchContext = createContext({
  ids: [],
  addFavoriteSearch: (id) => {},
  removeFavoriteSearch: (id) => {},
});


const insertToDb = async (id, term) => {
  await insertSavedSearch(id, term);
}


const removeFromDb = async (id) => {
  await removeSavedSearch(id);
}


function SearchContextProvider({ children }) {
  const [favoriteSearchIds, setFavoriteSearchIds] = useState([]);

  // IDS FROM favoriteSearchIds ARE STRINGS
  useEffect(() => {
    async function fetchFromDb() { // FETCH FROM DB TO FILL STATE
      const response = await readSavedSearch();
      const responseIdsArray = response.rows._array;
      //console.log('responseSearchIdsArray: ', responseIdsArray);
      const favIds = [];
      for (let objIds in responseIdsArray) {
        favIds.push((responseIdsArray[objIds].id).toString());
      }
      //console.log("favSearchIds arr: ", favIds);
      setFavoriteSearchIds(favIds);
    }
    fetchFromDb();
  }, []);


  function addFavoriteSearch(id, term) {
    setFavoriteSearchIds((currentFavoriteSearchIds) => [...currentFavoriteSearchIds, id]);
    // WRITE TO DB
    insertToDb(id, term);
  }

  function removeFavoriteSearch(id) {
    setFavoriteSearchIds((currentFavoriteSearchIds) =>
      currentFavoriteSearchIds.filter((searchId) => searchId !== id)
    );
    // DELETE FROM DB
    removeFromDb(id);
  }


  const value = {
    ids: favoriteSearchIds, // try using async storage get item as ids array
    addFavoriteSearch: addFavoriteSearch,
    removeFavoriteSearch: removeFavoriteSearch,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}


export default SearchContextProvider;