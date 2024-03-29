// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, set, get } from "firebase/database";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "apikey",
  authDomain: "authDomain",
  authDomain: "authDomain",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId"
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

export function writeUserData(addId, title, price, surface, bedrooms, bathrooms, type, transaction, year_built, description, location, phone, email, images, timestamp) {
  const db = getDatabase();
  set(ref(db, `ads/${addId}`), {
    id: addId,
    title: title,
    price: price,
    surface: surface,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    type: type,
    transaction: transaction,
    year_built: year_built,
    description: description,
    location: location,
    phone: phone,
    email: email,
    images: images,
    timestamp: timestamp
  });
}


