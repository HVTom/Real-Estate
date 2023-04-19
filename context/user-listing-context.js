//app-wide user ads state
import React, { createContext, useState, useEffect } from "react";
// user ads db
import { insertUserAds, readUserAds, removeUserAd } from "../util/userAds";



export const UserListingContext = createContext({
  ads: [],
  addUserAd: (id) => {},
  removeUserAd: (id) => {},
});


const insertToDb = async (id) => {
  await insertUserAds(id);
}

const removeFromDb = async (id) => {
  await removeUserAd(id);
}




function UserListingContextProvider({ children }) {
  const [userAds, setUserAds] = useState([]);

  // IDS FROM userAds ARE STRINGS
  useEffect(() => {
    async function fetchFromDb() { // FETCH FROM DB TO FILL STATE
      const response = await readUserAds();
      const responseUserIdsArray = response.rows._array;
      console.log('userAdsResponseArray: ', responseUserIdsArray);
      setUserAds(responseUserIdsArray);
    }
    fetchFromDb();
  }, []);


  function addUserAd(id) {
    setUserAds((currentFavoriteIds) => [...currentFavoriteIds, id]);
    // WRITE TO DB
    insertToDb(id);
  }

  function removeUserAd(id) {
    setUserAds((currentFavoriteIds) =>
      currentFavoriteIds.filter((estateId) => estateId !== id)
    );
    // DELETE FROM DB
    removeFromDb(id);
  }


  const value = {
    ads: userAds, // try using async storage get item as ids array
    addUserAd: addUserAd,
    removeUserAd: removeUserAd,
  };

  return <UserListingContext.Provider value={value}>{children}</UserListingContext.Provider>;
}


export default UserListingContextProvider;