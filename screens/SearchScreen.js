import React, { useEffect, useState, useContext } from "react";
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity, Pressable, Modal, ScrollView } from "react-native";
// get db
import { fetchAds } from "../util/db";
// search bar
import SearchBar from "../components/SearchBar";
// card
import AdCardComponent from "../components/AdCardComponent";
// context
import { FavoriteContext } from '../context/favorite-context';
import SavedAdCardComponent from "../components/SavedAdCardComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
// green ads
import { fetchGreenAds } from "../util/db";
// student ads
import { fetchStudentsAds } from "../util/db";


// add filters (filter by price/sqm mandatory feature)
// order by
// check for internet connection (low priority)
// alerts: save search, get push notification when updates happen in the db
// XXXX implement search by term XXXX
// XXXX use sqlite to persist user posted ads XXXX
// XXXX add 'for students' and 'Eco' sections XXXX
// XXXX add card component for land type (no beds baths / or conditional rendering instead) XXXX


// "For Students" section price limits
const MIN_PRICE = 150;
const MAX_PRICE = 350;

const SearchScreen = () => {
  const [term, setTerm] = useState('');
  const [ads, setAds] = useState([]);
  const [greenAds, setGreenAds] = useState([]);
  const [studentsAds, setStudentsAds] = useState([]);
  const favContext = useContext(FavoriteContext);


  useEffect(() => {
    async function getDefaultAds() {
      const defaultEstates = await fetchAds();
      const estatesGreen = defaultEstates.filter(ad => ad.type.includes("Eco"));
      console.log("eco type ads: ", estatesGreen);
      setGreenAds(estatesGreen);
      const estatesStudents = defaultEstates.filter(ad => ad.price >= MIN_PRICE && ad.price <= MAX_PRICE);
      console.log("ads for students: ", estatesStudents)
      setStudentsAds(estatesStudents);
    }
    getDefaultAds();
  }, [setGreenAds])



  const getRealtimeDb = () => {
    async function getAds() {
      const estates = await fetchAds();
      const estatesByTerm = estates.filter(
        ad => ad.title.toLowerCase().includes(term.toLowerCase()) ||
          ad.type.toLowerCase().includes(term.toLowerCase()) ||
          ad.description.toLowerCase().includes(term.toLowerCase()) ||
          ad.location.toLowerCase().includes(term.toLowerCase())
      );
      setAds(estatesByTerm);
      // const estatesGreen = estates.filter(ad => ad.type.includes("Eco"));
      // console.log("eco type ads: ", estatesGreen);
    }

    if (term.length != 0) {
      getAds();
    }
  }



  /* use a toggle for this functionality 
        <View>
          <Text>Filters here</Text>
          <Text>And sorting</Text>
        </View> 
  */


  // seach screen has default state shows two sections
  // if search is made defaultView is switched with searchView

  const defaultView = () => {
    return (
      <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false} >
        <View>
          <Text style={styles.sectionText}>Eco Housing</Text>
          <FlatList
            style={styles.list}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={greenAds}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              if (favContext.ids.includes(item.id)) {
                return (
                  <View>
                    <SavedAdCardComponent item={item} />
                  </View>
                );
              }
              else return (
                <View>
                  <AdCardComponent item={item} />
                </View>
              );
            }}
          />
        </View>
        <View>
          <Text style={styles.sectionText}>For Students</Text>
          <FlatList
            style={styles.list}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={studentsAds} // studentAds use filter to select between low-high prices
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              if (favContext.ids.includes(item.id)) {
                return (
                  <View>
                    <SavedAdCardComponent item={item} />
                  </View>
                );
              }
              else return (
                <View>
                  <AdCardComponent item={item} />
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    );
  }

  const searchView = () => {
    return (
      <View style={styles.screenContainer}>
        {ads.length == 0 ? <Text>No results found for "{term}"</Text> : <Text>"{term}" returned {ads.length} results</Text>}
        <FlatList
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
          data={ads}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            if (favContext.ids.includes(item.id)) {
              return (
                <View>
                  <SavedAdCardComponent item={item} />
                </View>
              );
            }
            else return (
              <View>
                <AdCardComponent item={item} />
              </View>
            );
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <SearchBar term={term} onTermChange={input => setTerm(input)}
        onTermSubmit={() => getRealtimeDb()}
      />
      {term.length == 0 ? defaultView() : searchView()}
    </View>
  );
}


const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  list: {
    marginLeft: 7,
    alignSelf: 'center',
    //overflow: 'hidden'
  },
  sectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10
  },
  // view encapsulates horizontal sections
  sectionsContainer: {
    display: 'flex',
    alignSelf: 'center',
    //marginVertical: 10,
  },
  section: {
    //marginVertical: 10,
  },
});


export default SearchScreen;