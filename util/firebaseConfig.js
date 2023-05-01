// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, set, get } from "firebase/database";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhf3nb3fy_olCvHL-P66GX5-W3iqep8dw",
  authDomain: "realestate-bf707.firebaseapp.com",
  databaseURL: "https://realestate-bf707-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "realestate-bf707",
  storageBucket: "realestate-bf707.appspot.com",
  messagingSenderId: "709528688933",
  appId: "1:709528688933:web:5835f41b29b50b7762a2cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

const dbRef = ref(getDatabase());

export const getRealtimeDbData = () => {
  get(child(dbRef, `ads`)).then((snapshot) => {
    if (snapshot.exists()) {
      let result = snapshot.val();
      //console.log(snapshot.val());
      return result;
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  })
};

export function writeUserData(addId, title, price, surface, bedrooms, bathrooms, type, year_built, description, location, phone, email, images) {
  const db = getDatabase();
  set(ref(db, `ads/${addId}`), {
    id: addId,
    title: title,
    price: price,
    surface: surface,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    type: type,
    year_built: year_built,
    description: description,
    location: location,
    phone: phone,
    email: email,
    images: images
  });
}


