import axios from "axios";



// export async function postAds(data) {
//   const request = await axios.post(`${RTDB_URL}/ads.json?`, data); generates auto id on post; reference does not
// data = object
  
// }


// TODO: should become fetchAds(location)
export async function fetchAds() {
  const response = await axios.get(`${RTDB_URL}/ads.json?`);

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
      transaction: response.data[key].transaction,
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




// fetch only the new ads (between previous open and current open)
// barebone, used for notifications
export async function fetchNewAds(prev, curr) {
  const response = await axios.get(`${RTDB_URL}/ads.json?orderBy="timestamp"&startAt=${prev}&endAt=${curr}`);

  const ads = []; // array of ads 

  for (let key in response.data) {
    let adObj = {
      // id: key,
      // title: response.data[key].title,
      // price: response.data[key].price,
      // surface: response.data[key].surface,
      // bedrooms: response.data[key].bedrooms,
      // bathrooms: response.data[key].bathrooms,
      // type: response.data[key].type,
      // transaction: response.data[key].transaction,
      // year_built: response.data[key].year_built,
      // description: response.data[key].description,
      location: response.data[key].location,
      // phone: response.data[key].phone,
      // email: response.data[key].email,
      // images: response.data[key].images,
      timestamp: response.data[key].timestamp
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
  //console.log("DB FILE: fetched new ads: ", ads);
  return ads;
}
//////////////





// used for fetching ads for the eco section
export async function fetchGreenAds() {
  const response = await axios.get(`${RTDB_URL}/ads.json?orderBy="type"&equalTo="Eco"`); // TOD: try using it now, replaced '/' with '?'

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
      transaction: response.data[key].transaction,
      year_built: response.data[key].year_built,
      description: response.data[key].description,
      location: response.data[key].location,
      phone: response.data[key].phone,
      email: response.data[key].email,
      images: response.data[key].images,
      timestamp: response.data[key].timestamp
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


// used for fetching low-priced (for students) ads
export async function fetchStudentsAds() {
  const response = await axios.get(`${RTDB_URL}/ads.json?orderBy="price"&startAt=150&endAt=350`);

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
      transaction: response.data[key].transaction,
      year_built: response.data[key].year_built,
      description: response.data[key].description,
      location: response.data[key].location,
      phone: response.data[key].phone,
      email: response.data[key].email,
      images: response.data[key].images,
      timestamp: response.data[key].timestamp
      //imags: {} //[] adObj.imgs.push(imgObj)
    };
    let imgObj = {
      assetId: null,
      b64: null,
    }
    for (let image in response.data[key].images) {
      // console.log("id: ", response.data[key].images[image].assetId);
      // console.log("base64: ", response.data[key].images[image].b64);
      // console.log("DB price: ", response.data[key].price);

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




// FOR YOU SECTION - FETCH BY MOST SEARCHED TERM
export async function fetchByMostSearched(term) {
  const response = await axios.get(`${RTDB_URL}/ads.json?orderBy="location"&equalTo="${term}"`);

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
      transaction: response.data[key].transaction,
      year_built: response.data[key].year_built,
      description: response.data[key].description,
      location: response.data[key].location,
      phone: response.data[key].phone,
      email: response.data[key].email,
      images: response.data[key].images,
      timestamp: response.data[key].timestamp
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
  //console.log("DB FILE: fetched new ads: ", ads);
  return ads;
}




//TO BE DELETED fetch only 5 new ads (between previous open and current open) // TO BE DELETED
export async function fetch5NewAds(prev, curr) {
  const response = await axios.get(`${RTDB_URL}/ads.json?orderBy="timestamp"&startAt=${prev}&endAt=${curr}&limitToFirst=5`);

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
      transaction: response.data[key].transaction,
      year_built: response.data[key].year_built,
      description: response.data[key].description,
      location: response.data[key].location,
      phone: response.data[key].phone,
      email: response.data[key].email,
      images: response.data[key].images,
      timestamp: response.data[key].timestamp
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
  //console.log("DB FILE: fetched new ads: ", ads);
  return ads;
}




////////_________fetches for filling charts________/////////////
// for each big city, calculate the average price for rentals and sales
// add the data to stats screen

export async function average(loc) {
  const response = await axios.get(`${RTDB_URL}/ads.json?orderBy="location"&equalTo="${loc}"`); // TOD: try using it now, replaced '/' with '?'

  const ads = []; // array of ads 

  for (let key in response.data) {
    let adObj = {
      // id: key,
      // title: response.data[key].title,
      price: response.data[key].price,
      // surface: response.data[key].surface,
      // bedrooms: response.data[key].bedrooms,
      // bathrooms: response.data[key].bathrooms,
      // type: response.data[key].type,
      transaction: response.data[key].transaction,
      // year_built: response.data[key].year_built,
      // description: response.data[key].description,
      location: response.data[key].location,
      // phone: response.data[key].phone,
      // email: response.data[key].email,
      // images: response.data[key].images,
      // timestamp: response.data[key].timestamp
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




















