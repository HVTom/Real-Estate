import axios from "axios";

const TOKEN = 'mapbox token';


export async function getCoords(address) {
  try {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${TOKEN}&limit=1`);
    return response;
  } catch (error) {
    console.log(error);
  }
}
