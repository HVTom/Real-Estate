import React, { useEffect, useState, useContext } from "react";
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity, Pressable, Modal, ScrollView, Animated } from "react-native";
// get db
import { fetchAds } from "../util/db";
// search bar
import SearchBar from "../components/SearchBar";
// card
import AdCardComponent from "../components/AdCardComponent";
// context
import { FavoriteContext } from '../context/favorite-context';
import SavedAdCardComponent from "../components/SavedAdCardComponent";
import { SearchContext } from "../context/search-context";
// saved search insert
import { insertSavedSearch } from "../util/search";
import { Colors } from "../constants/styles";



// TODO: alerts: save search, get push notification when updates happen in the db -> show in Alerts screen; 
// 2 options: set alert directly from Alerts screen(easier, limit user to create alert based only on location) 
// make the location column unique in db to avoid duplicate saves and don't be forced by an id to keep track
// of the saves
//or save from search bar
// TODO: add filters (filter by price/sqm mandatory feature)
// TODO: order by (you cant order by multiple params; do a fetch for each param )
// TODO: rename persistence.js and db.js
// TODO: check for internet connection (low priority)
// XXXX .trim() on text input deletes final whitespace XXXX
// XXXX implement search by term XXXX
// XXXX use sqlite to persist user posted ads XXXX
// XXXX add 'for students' and 'Eco' sections XXXX
// XXXX add card component for land type (no beds baths / or conditional rendering instead) XXXX


// "For Students" section price limits
const MIN_PRICE = 150.00;
const MAX_PRICE = 350.00;

const SearchScreen = ({ route }) => {
  const [term, setTerm] = useState('');
  const [ads, setAds] = useState([]);
  const [greenAds, setGreenAds] = useState([]);
  const [studentsAds, setStudentsAds] = useState([]);
  const favContext = useContext(FavoriteContext);
  const srchContext = useContext(SearchContext);




  useEffect(() => {
    async function getDefaultAds() {
      const defaultEstates = await fetchAds();
      const estatesGreen = defaultEstates.filter(ad => ad.type.includes("Eco"));
      //console.log("eco type ads: ", estatesGreen);
      setGreenAds(estatesGreen);
      const estatesStudents = defaultEstates.filter(ad => ad.price >= MIN_PRICE && ad.price <= MAX_PRICE);
      //console.log("ads for students: ", estatesStudents)
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


  // generate id for ad
  const generateSearchId = () => {
    // generate a 3 digit number
    let id = 0;
    id = Math.floor(100 + Math.random() * 900);
    return id;
  }

  const saveSearch = () => {
    //generate id
    const id = generateSearchId();
    // insert to context
    srchContext.addFavoriteSearch(id, term);
    // insert term to search db
    //insertSavedSearch(id, term);
  }


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
            data={studentsAds}
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
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: '5%', alignItems: 'center' }} >
          {ads.length == 0 && <Text style={styles.resultInfoText} >No results found for "{term}"</Text>}
          {ads.length == 1 && <Text style={styles.resultInfoText}>"{term}" returned {ads.length} result</Text>}
          {ads.length > 1 && <Text style={styles.resultInfoText}>"{term}" returned {ads.length} results</Text>}
          {ads.length >= 1 && (<View><TouchableOpacity onPress={saveSearch} style={styles.saveSearchBtn}><Text style={styles.saveSearchText}>Save search</Text></TouchableOpacity></View>)}
        </View>
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
    //marginLeft: 7,
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
  resultInfoText: {
    marginLeft: '5%',
  },
  saveSearchBtn: {
    borderColor: Colors.primaryPurple,
    borderWidth: 1,
    padding: 2
  },
  saveSearchText: {
    color: Colors.primaryPurple
  },
});


export default SearchScreen;