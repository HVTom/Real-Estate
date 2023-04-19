import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
// card component
import SavedAdCardComponent from "../components/SavedAdCardComponent";
// favorites context
import { FavoriteContext } from "../context/favorite-context";
import { fetchAds } from "../util/db";
// get from db
import { readFavorite, removeFavorite } from "../util/persistence";
import { dropMyAd } from "../util/userAds";



const FavoritesScreen = () => {
  const [favAds, setFavAds] = useState([]);
  const favContext = useContext(FavoriteContext);


  console.log(favContext.ids); // ids array from context has all the ids of the saved ads; now fetch from db the ads with said ids

  useEffect(() => {
    async function fetchFromDb() {
      await readFavorite();
    }
    fetchFromDb();
  }, []);



  useEffect(() => {
    async function getFavAds() {
      const estates = await fetchAds();//aduc din bd
      if (favContext.ids) {
        const favEstates = estates.filter((ad => favContext.ids.includes(ad.id)));// selectez doar anunturile salvate
        setFavAds(favEstates);
      }
    }

    getFavAds();
  }, [favContext])

  //console.log("fav ads: ", favAds);


  if (favContext.ids.length == 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No favorites yet</Text>
      </View>
    );
  }


  return (
    <View style={styles.screenContainer}>
      {favContext.ids.length == 1 && (<Text>You have {favContext.ids.length} favorite listing</Text>)}
      {favContext.ids.length > 1 && (<Text>You have {favContext.ids.length} favorites listings</Text>)}
      <Button title="Drop myads DB" onPress={() => dropMyAd()} />
      <FlatList
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        data={favAds}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          return (
            <View>
              <SavedAdCardComponent item={item} />
            </View>
          );
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  listContainer: {
    alignSelf: 'center',
    overflow: 'hidden'
  },
  empty: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: 26,
    fontWeight: 'bold'
  },
});


export default FavoritesScreen;