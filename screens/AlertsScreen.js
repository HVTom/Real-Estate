import React, { useState, useEffect, useContext } from "react";
import { Button, View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable } from "react-native";
// search context
import { SearchContext } from "../context/search-context";
// dqlite search db fetch
import { readSavedSearch } from "../util/search";
// SavedSearch Component
import SavedSearch from "../components/SavedSearch";


const AlertsScreen = ({ navigation }) => {
  const [searches, setSearches] = useState([]);
  const srchContext = useContext(SearchContext);


  useEffect(() => {
    //console.log("userAdsContext.ads: ", userAdsContext.ads);

    async function fetchSavedSearches() {
      const response = await readSavedSearch(); // read from sqlite
      const responseIdsArray = response.rows._array;
      //console.log('Sqlite user ads: ', responseIdsArray);
      setSearches(responseIdsArray);
    }
    fetchSavedSearches();
  }, [srchContext]);



  // TODO: alert ideea: when a user uploads an ad, send push notifications to those who
  // have in the saved search list the same home type
  // SAU
  // save the db snapshot at every app open, and compare to the current snapshot to the previous;
  // if there are any changes and the desired types are met send local notif
  // 


  return (
    <View>
      {searches.length > 0 && <Text>You have {searches.length} saved searches</Text>}
      <FlatList
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        data={searches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <SavedSearch item={item} />}
      />
    </View>
  );
}


const styles = StyleSheet.create({});


export default AlertsScreen;