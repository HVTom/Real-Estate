import axios from "axios";

const RTDB_URL = 'https://realestate-bf707-default-rtdb.europe-west1.firebasedatabase.app';


// export async function postAds(data) {
//   const request = await axios.post(`${RTDB_URL}/ads.json?`, data); generates auto id on post; reference does not
// data = object
  
// }


export async function fetchAds() {
  const response = await axios.get(`${RTDB_URL}/ads.json`);

  const ads = []; // array of ads 

  for (let key in response.data) {
    let adObj = {
      id: key,
      title: response.data[key].title,
      price: response.data[key].price,
      surface: response.data[key].surface,
      bedrooms: response.data[key].bedrooms,
      bathrooms: response.data[key].bathrooms,
      type: response.data[key].type,
      year_built: response.data[key].year_built,
      description: response.data[key].description,
      location: response.data[key].location,
      phone: response.data[key].phone,
      email: response.data[key].email,
      images: response.data[key].images
      //imags: {} //[] adObj.imgs.push(imgObj)
    };
    let imgObj = {
      assetId: null,
      b64: null,
    }
    for (let image in response.data[key].images) {
      // console.log("id: ", response.data[key].images[image].assetId);
      // console.log("base64: ", response.data[key].images[image].b64);

      imgObj = {
        assetId: response.data[key].images[image].assetId,
        b64: response.data[key].images[image].b64,
      }
      //Object.assign(adObj.imags, imgObj);
    }
    ads.push(adObj);
  }
  return ads;
}



// delete ad
export async function deleteAd(id) {
  //const response = 
  await axios.delete(`${RTDB_URL}/ads/${id}.json`);
  // if (response === NULL) {
  //   console.log('Ad deleted succesfully');
  // }

  // return response;
}




// TODO: fetch with orderBy: price, surface, bedrroms, bathrooms,





// (UNUSED) fetch green/eco housing breaks the search screen
export async function fetchGreenAds() {
  const response = await axios.get(`${RTDB_URL}/ads.json/orderBy="$type"&equalTo="Eco"`);
  //   const response = await axios.get(`${RTDB_URL}/ads.json`); maybe put both fethces here??


  const ads = []; // array of ads 

  for (let key in response.data) {
    let adObj = {
      id: key,
      title: response.data[key].title,
      price: response.data[key].price,
      surface: response.data[key].surface,
      bedrooms: response.data[key].bedrooms,
      bathrooms: response.data[key].bathrooms,
      type: response.data[key].type,
      year_built: response.data[key].year_built,
      description: response.data[key].description,
      location: response.data[key].location,
      phone: response.data[key].phone,
      email: response.data[key].email,
      images: response.data[key].images
      //imags: {} //[] adObj.imgs.push(imgObj)
    };
    let imgObj = {
      assetId: null,
      b64: null,
    }
    for (let image in response.data[key].images) {
      // console.log("id: ", response.data[key].images[image].assetId);
      // console.log("base64: ", response.data[key].images[image].b64);

      imgObj = {
        assetId: response.data[key].images[image].assetId,
        b64: response.data[key].images[image].b64,
      }
      //Object.assign(adObj.imags, imgObj);
    }
    ads.push(adObj);
  }
  return ads;
}


//(UNUSED) fetch low-priced (for students) ads
export async function fetchStudentsAds() {
  const response = await axios.get(`${RTDB_URL}/ads.json`);

  const ads = []; // array of ads 

  for (let key in response.data) {
    let adObj = {
      id: key,
      title: response.data[key].title,
      price: response.data[key].price,
      surface: response.data[key].surface,
      bedrooms: response.data[key].bedrooms,
      bathrooms: response.data[key].bathrooms,
      type: response.data[key].type,
      year_built: response.data[key].year_built,
      description: response.data[key].description,
      location: response.data[key].location,
      phone: response.data[key].phone,
      email: response.data[key].email,
      images: response.data[key].images
      //imags: {} //[] adObj.imgs.push(imgObj)
    };
    let imgObj = {
      assetId: null,
      b64: null,
    }
    for (let image in response.data[key].images) {
      // console.log("id: ", response.data[key].images[image].assetId);
      // console.log("base64: ", response.data[key].images[image].b64);

      imgObj = {
        assetId: response.data[key].images[image].assetId,
        b64: response.data[key].images[image].b64,
      }
      //Object.assign(adObj.imags, imgObj);
    }
    ads.push(adObj);
  }
  return ads;
}