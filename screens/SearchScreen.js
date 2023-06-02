import React, { useEffect, useState, useContext } from "react";
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity, Pressable, Modal, ScrollView, Animated } from "react-native";
// get db
import { fetchAds, fetchGreenAds, fetchStudentsAds, fetchByMostSearched } from "../util/db";
// search bar
import SearchBar from "../components/SearchBar";
// icon
import { Feather, FontAwesome5, AntDesign } from '@expo/vector-icons';
// card
import AdCardComponent from "../components/AdCardComponent";
// context
import { FavoriteContext } from '../context/favorite-context';
import SavedAdCardComponent from "../components/SavedAdCardComponent";
import { SearchContext } from "../context/search-context";
// saved search insert
import { insertSavedSearch } from "../util/search";
import { Colors } from "../constants/styles";
// local storage for timestamp
import AsyncStorage from '@react-native-async-storage/async-storage';





// TODO: add charts
// XXXX save user email to async storage on signup/login, extract it on the account screen XXXX
// XXXX move savede seaches with favotites XXXX
// XXXX alerts: add timestamp to each listing; when the app opens, save the timestamp (Date.now()) locally.
// do a GET with order by timestamp from (previous locally saved timestamp) to (Date.now())
// fetch then update locally saved time XXX
// XXXX or save from search bar XXXX
// XXXX add filters (filter by price/sqm mandatory feature) XXXXX
// XXXX order by XXXX
// XXXX rename persistence.js and db.js XXXX
// XXXX .trim() on text input deletes final whitespace XXXX
// XXXX implement search by term XXXX
// XXXX use sqlite to persist user posted ads XXXX
// XXXX add 'for students' and 'Eco' sections XXXX
// XXXX add card component for land type (no beds baths / or conditional rendering instead) XXXX


// "For Students" section price limits
const MIN_PRICE = 150.00;
const MAX_PRICE = 350.00;

const SearchScreen = () => {
  const [term, setTerm] = useState('');
  const [ads, setAds] = useState([]);
  const [greenAds, setGreenAds] = useState([]);
  const [studentsAds, setStudentsAds] = useState([]);
  const [forYouAds, setForYouAds] = useState([]);
  const [minVal, setMinVal] = useState();
  const [maxVal, setMaxVal] = useState();
  const [transax, setTransax] = useState('');
  const favContext = useContext(FavoriteContext);
  const srchContext = useContext(SearchContext);
  const [modalVisible, setModalVisible] = useState(false);
  // radio buttons sort state/behaviour
  const [selectedSortBtn, setSelectedSortBtn] = useState('');
  const [selectedSaleRentBtn, setSelectedSaleRentBtn] = useState('');
  const [selectedFilterBtn, setSelectedFilterBtn] = useState('');


  // retrieve the budget range; used in "For you" section for better accuracy
  useEffect(() => {
    const getBudgetValues = async () => {
      try {
        let minV = await AsyncStorage.getItem("minVal");
        console.log("Search screen -> Extracted min value: ", minV);
        setMinVal(minV);
        let maxV = await AsyncStorage.getItem("maxVal");
        console.log("Search screen -> Extracted min value: ", maxV);
        setMaxVal(maxV);
        let tsx = await AsyncStorage.getItem("transaction");
        console.log("Search screen -> Extracted transaction value: ", tsx);
        setTransax(tsx.trim());
      } catch (error) {
        console.log("Couldn't extract minVal and MaxVal from lcoal storage. Reason: ", error);
      }
    }
    getBudgetValues();
  }, [minVal, maxVal, transax]);


  useEffect(() => {
    async function getDefaultAds() {
      //const defaultEstates = await fetchAds();
      //const estatesGreen = defaultEstates.filter(ad => ad.type.includes("Eco"));
      const estatesGreen = await fetchGreenAds();
      //console.log("eco type ads: ", estatesGreen);
      setGreenAds(estatesGreen);
      //const estatesStudents = defaultEstates.filter(ad => ad.price >= MIN_PRICE && ad.price <= MAX_PRICE);
      const estatesStudents = await fetchStudentsAds();
      //console.log("ads for students: ", estatesStudents)
      setStudentsAds(estatesStudents);
      // for you section - shows ads with location based on most searched terms

      const savedSearchTerms = await AsyncStorage.getItem('searchTerms');
      //const searchTermsArray = savedSearchTerms ? JSON.parse(savedSearchTerms) : [];
      searchTermsArray = JSON.parse(savedSearchTerms);
      console.log("searchTermsArray: ", searchTermsArray);
      let freqCity = frequency(searchTermsArray);
      console.log("Most searched city: ", freqCity);
      //setMostSearched(freqCity);

      const forYou = await fetchByMostSearched(freqCity);
      console.log("forYou section: ", forYou);
      //const forYouPriceRange = [];
      if (transax == "Both") {
        let forYouPriceRange = forYou.filter(
          ad => ad.price >= minVal && ad.price <= maxVal
        );
        setForYouAds(forYouPriceRange);
        console.log("forYouPriceRange: ", forYouPriceRange);
      } else {
        let forYouPriceRange = forYou.filter(
          ad => ad.price >= minVal && ad.price <= maxVal && ad.transaction == transax
        );
        setForYouAds(forYouPriceRange);
        console.log("forYouPriceRange: ", forYouPriceRange);
      }
    }
    getDefaultAds();
  }, [minVal, maxVal, transax])// make sure useEffect runs after minVal and max Val are fetched


  const getRealtimeDb = () => {
    async function getAds() {
      const estates = await fetchAds();
      const estatesByTerm = estates.filter(
        ad => ad.title.toLowerCase().includes(term.toLowerCase()) ||
          //ad.type.toLowerCase().includes(term.toLowerCase()) ||
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
          {greenAds.length == 0 ?
            (
              <View>
                <Text style={styles.noContentText}>No listings at the moment</Text>
              </View>
            ) :
            (
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
            )
          }
        </View>
        <View>
          <Text style={styles.sectionText}>For Students</Text>
          {studentsAds.length == 0 ?
            (
              <View>
                <Text style={styles.noContentText}>No listings at the moment</Text>
              </View>
            ) :
            (
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
            )
          }
        </View>
        <View>
          <Text style={styles.sectionText}>For you</Text>
          {forYouAds.length == 0 ?
            (
              <View>
                <Text style={styles.noContentText}>No new listings at the moment</Text>
              </View>
            ) :
            (
              <FlatList
                style={styles.list}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={forYouAds}
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
            )
          }
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




  if (modalVisible === true) {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType='fade'
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* Sorting */}
              <Text style={styles.modalTitle} >Sort by</Text>

              <View style={styles.category}>
                <View style={selectedSortBtn === 'PriceLoHi' ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedSortBtn("PriceLoHi");
                    const priceAscending = [...ads].sort((a, b) => a.price - b.price);
                    // for(var listing in priceAscending) {
                    //   console.log(`#${priceAscending[listing].id} - ${priceAscending[listing].price}`);
                    // }
                    setAds(priceAscending);
                    setModalVisible(!modalVisible)
                  }}>
                    <Text style={selectedSortBtn === 'PriceLoHi' ? styles.sortOptionSelectedText : styles.sortOptionText} >Price</Text>
                  </TouchableOpacity>
                  <Feather name="arrow-up" size={24} color={selectedSortBtn === 'PriceLoHi' ? Colors.primaryPurple : 'black'} />
                </View>

                <View style={selectedSortBtn === 'PriceHiLo' ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedSortBtn("PriceHiLo");
                    const priceDescending = [...ads].sort((a, b) => b.price - a.price);
                    setAds(priceDescending);
                    setModalVisible(!modalVisible)
                  }}>
                    <Text style={selectedSortBtn === 'PriceHiLo' ? styles.sortOptionSelectedText : styles.sortOptionText}>Price</Text>
                  </TouchableOpacity>
                  <Feather name="arrow-down" size={24} color={selectedSortBtn === 'PriceHiLo' ? Colors.primaryPurple : 'black'} />
                </View>
              </View>

              <View style={styles.category}>
                <View style={selectedSortBtn === 'SurfaceLoHi' ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedSortBtn('SurfaceLoHi');
                    const surfaceAscending = [...ads].sort((a, b) => a.surface - b.surface);
                    setAds(surfaceAscending);
                    setModalVisible(!modalVisible)
                  }}>
                    <Text style={selectedSortBtn === 'SurfaceLoHi' ? styles.sortOptionSelectedText : styles.sortOptionText}>Surface</Text>
                  </TouchableOpacity>
                  <Feather name="arrow-up" size={24} color={selectedSortBtn === 'SurfaceLoHi' ? Colors.primaryPurple : 'black'} />
                </View>

                <View style={selectedSortBtn === 'PriceSurfaceLoHi' ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedSortBtn('PriceSurfaceLoHi');
                    const pricePerSurfaceAsc = [...ads].sort((a, b) => a.price / a.surface - b.price / b.surface);
                    setAds(pricePerSurfaceAsc);
                    setModalVisible(!modalVisible)
                  }}>
                    <Text style={selectedSortBtn === 'PriceSurfaceLoHi' ? styles.sortOptionSelectedText : styles.sortOptionText}>Price/Surface</Text>
                  </TouchableOpacity>
                  <Feather name="arrow-up" size={24} color={selectedSortBtn === 'PriceSurfaceLoHi' ? Colors.primaryPurple : 'black'} />
                </View>
              </View>


              <View style={styles.category}>
                <View style={selectedSortBtn === 'PriceSurfaceHiLo' ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedSortBtn('PriceSurfaceHiL');
                    const pricePerSurfaceDesc = [...ads].sort((a, b) => b.price / b.surface - a.price / a.surface);
                    setAds(pricePerSurfaceDesc);
                    setModalVisible(!modalVisible)
                  }}>
                    <Text style={selectedSortBtn === 'PriceSurfaceHiLo' ? styles.sortOptionSelectedText : styles.sortOptionText}>Price/Surface</Text>
                  </TouchableOpacity>
                  <Feather name="arrow-down" size={24} color={selectedSortBtn === 'PriceSurfaceHiLo' ? Colors.primaryPurple : 'black'} />
                </View>

                <View style={selectedSortBtn === 'SurfaceHiLo' ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedSortBtn('SurfaceHiLo');
                    const surfaceDescending = [...ads].sort((a, b) => b.surface - a.surface);
                    setAds(surfaceDescending);
                    setModalVisible(!modalVisible)
                  }}>
                    <Text style={selectedSortBtn === 'SurfaceHiLo' ? styles.sortOptionSelectedText : styles.sortOptionText}>Surface</Text>
                  </TouchableOpacity>
                  <Feather name="arrow-down" size={24} color={selectedSortBtn === 'SurfaceHiLo' ? Colors.primaryPurple : 'black'} />
                </View>
              </View>




              {/* Filtering - must be able to select multiple options here, do the filtering at 'Search press' */}
              <Text style={styles.modalTitle}>Filter by</Text>
              <View style={styles.category}>
                <View style={selectedSaleRentBtn === 'Sale' ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedSaleRentBtn('Sale');
                    const transxType = ads.filter(
                      ad => ad.transaction.includes('Sale'));
                    setAds(transxType);
                    //setModalVisible(!modalVisible);
                  }}>
                    <Text style={selectedSaleRentBtn === 'Sale' ? styles.sortOptionSelectedText : styles.sortOptionText}>Sale</Text>
                  </TouchableOpacity>
                </View>
                <View style={selectedFilterBtn === 'Rent' ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedSaleRentBtn('Rent');
                    const transxType = ads.filter(
                      ad => ad.transaction.includes('Rent'));
                    setAds(transxType);
                    //setModalVisible(!modalVisible);
                  }}>
                    <Text style={selectedSaleRentBtn === 'Rent' ? styles.sortOptionSelectedText : styles.sortOptionText}>Rent</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/*estate type*/}
              <Text style={styles.categoryTitle}>Estate type</Text>
              <View style={styles.category}>
                <View style={selectedFilterBtn.includes('Eco') ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedFilterBtn([...selectedFilterBtn, 'Eco']);
                    const transxType = ads.filter(
                      ad => ad.transaction.includes('Eco'));
                    setAds(transxType);
                    //setModalVisible(!modalVisible);
                  }}>
                    <Text style={selectedFilterBtn.includes('Eco') ? styles.sortOptionSelectedText : styles.sortOptionText}>Eco</Text>
                  </TouchableOpacity>
                </View>
                <View style={selectedFilterBtn.includes('Apartment') ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedFilterBtn([...selectedFilterBtn, 'Apartment']);
                    const transxType = ads.filter(
                      ad => ad.transaction.includes('Apartment'));
                    setAds(transxType);
                    //setModalVisible(!modalVisible);
                  }}>
                    <Text style={selectedFilterBtn.includes('Apartment') ? styles.sortOptionSelectedText : styles.sortOptionText}>Apartment</Text>
                  </TouchableOpacity>
                </View>
                <View style={selectedFilterBtn.includes('Duplex') ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedFilterBtn([...selectedFilterBtn, 'Duplex']);
                    const transxType = ads.filter(
                      ad => ad.transaction.includes('Duplex'));
                    setAds(transxType);
                    //setModalVisible(!modalVisible);
                  }}>
                    <Text style={selectedFilterBtn.includes('Duplex') ? styles.sortOptionSelectedText : styles.sortOptionText}>Duplex</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.category}>
                <View style={selectedFilterBtn.includes('Residential Complex') ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedFilterBtn([...selectedFilterBtn, 'Residential Complex']);
                    const transxType = ads.filter(
                      ad => ad.transaction.includes('Residential Complex'));
                    setAds(transxType);
                    //setModalVisible(!modalVisible);
                  }}>
                    <Text style={selectedFilterBtn.includes('Residential Complex') ? styles.sortOptionSelectedText : styles.sortOptionText}>Residential Complex</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.category}>
                <View style={selectedFilterBtn.includes('House') ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedFilterBtn([...selectedFilterBtn, 'House']);
                    const transxType = ads.filter(
                      ad => ad.transaction.includes('House'));
                    setAds(transxType);
                    //setModalVisible(!modalVisible);
                  }}>
                    <Text style={selectedFilterBtn.includes('House') ? styles.sortOptionSelectedText : styles.sortOptionText}>House</Text>
                  </TouchableOpacity>
                </View>
                <View style={selectedFilterBtn.includes('Land') ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedFilterBtn([...selectedFilterBtn, 'Land']);
                    const transxType = ads.filter(
                      ad => ad.transaction.includes('Land'));
                    setAds(transxType);
                    //setModalVisible(!modalVisible);
                  }}>
                    <Text style={selectedFilterBtn.includes('Land') ? styles.sortOptionSelectedText : styles.sortOptionText}>Land</Text>
                  </TouchableOpacity>
                </View>
                <View style={selectedFilterBtn.includes('Villa') ? styles.sortOptionSelected : styles.sortOption}>
                  <TouchableOpacity onPress={() => {
                    setSelectedFilterBtn([...selectedFilterBtn, 'Villa']);
                    const transxType = ads.filter(
                      ad => ad.transaction.includes('Villa'));
                    setAds(transxType);
                    //setModalVisible(!modalVisible);
                  }}>
                    <Text style={selectedFilterBtn.includes('Villa') ? styles.sortOptionSelectedText : styles.sortOptionText}>Villa</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/*beds baths*/}


            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} >
              <Text style={styles.search}>Search</Text>
            </TouchableOpacity>
          </View>
        </Modal >
      </View >
    );
  }

  ///////////////////////////////////////////////////////////////////
  const frequency = (arr) => {
    let element = '';
    let max = -999999;
    for (let i in arr) {
      let count = 0;
      for (let j in arr) {
        if (arr[i] === arr[j]) {
          count++
        }
      }
      if (count > max) {
        max = count;
        element = arr[i];
      }
    }
    console.log(`Element ${element} has frequency ${max}.`);
    return element;
  }


  const loadSearchTerms = async () => {
    try {
      const savedSearchTerms = await AsyncStorage.getItem('searchTerms');
      const searchTermsArray = savedSearchTerms ? JSON.parse(savedSearchTerms) : [];
      //console.log('\nSearch terms loaded successfully:', searchTermsArray);
      // let freqCity = frequency(searchTermsArray);
      // console.log("Most searched city: ", freqCity);
      // console.log("mostSearched", JSON.stringify(mostSearched));
      // setMostSearched(freqCity);
      return searchTermsArray;
    } catch (error) {
      console.log('Failed to load search terms:', error);
      return [];
    }
  };




  const saveSearchTerm = async (term) => {
    try {
      const searchTermsArray = await loadSearchTerms();
      searchTermsArray.push(term);
      await AsyncStorage.setItem('searchTerms', JSON.stringify(searchTermsArray));
      console.log(`\nSearch term ${term} saved successfully.`);
      //console.log('\nSearch terms after added term: ', searchTermsArray);
    } catch (error) {
      console.log('Failed to save search term:', error);
    }
  };


  return (
    <View style={styles.screenContainer}>
      <View style={styles.barIcon} >
        <SearchBar term={term} onTermChange={input => setTerm(input)}
          onTermSubmit={() => {
            //add search term to async storage only if there are results?
            //if (ads.length > 0) {
            // call the func that returns the most searched term/s
            saveSearchTerm(term);
            //}
            //
            setSelectedSortBtn('');
            setSelectedSaleRentBtn('');
            setSelectedFilterBtn('');
            getRealtimeDb();
          }}
        />
        <TouchableOpacity style={styles.filter} onPress={() => setModalVisible(true)} >
          <Feather name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {term.length == 0 ? defaultView() : searchView()}
    </View>
  );
}


const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  barIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',

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


  // sort by modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  modalView: {
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    height: '70%'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  //modal title
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  // sort option button
  sortOption: {
    marginBottom: 10,
    marginHorizontal: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    //align: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15
  },
  sortOptionSelected: {
    marginBottom: 10,
    marginHorizontal: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    //align: 'center',
    borderColor: Colors.primaryPurple,
    borderWidth: 1,
    borderRadius: 15
  },
  sortOptionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 15
  },
  sortOptionSelectedText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 15,
    color: Colors.primaryPurple
  },
  // filtering
  category: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: '5%'
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 5
  },
  search: {
    color: Colors.primaryPurple,
    borderWidth: 1,
    borderColor: Colors.primaryPurple,
    borderRadius: 15,
    padding: 5,
    fontSize: 18,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  noContentText: {
    fontSize: 20,
    marginVertical: 20,
    alignSelf: 'center'
  },
});


export default SearchScreen;