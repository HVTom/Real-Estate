import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native';
import UserAdCard from '../components/UserAdCard';
import { readUserAds } from '../util/userAds';
import { UserListingContext } from '../context/user-listing-context';


const UserListingsScreen = () => {
  const [userAds, setUserAds] = useState([]);
  const userAdsContext = useContext(UserListingContext);


  useEffect(() => {
    //console.log("userAdsContext.ads: ", userAdsContext.ads);

    async function fetchFromUserAds() {
      const response = await readUserAds(); // read from sqlite
      const responseIdsArray = response.rows._array;
      //console.log('Sqlite user ads: ', responseIdsArray);
      setUserAds(responseIdsArray);
    }
    fetchFromUserAds();
  }, [userAdsContext]);

  return (
    <View style={styles.page}>
      <Text>{userAds.length} listings</Text>
      {userAds.length == 0 ? <Text style={styles.title}>You have no listings yet</Text> : <Text style={styles.title}>Your Listings</Text>}
      <FlatList
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        data={userAds}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <UserAdCard item={item} />}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: 0,
    padding: 0
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 15,
  },
  emptyListingText: {
    display: 'flex',
    flex: 1,
    //flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});


export default UserListingsScreen;