import axios from "axios";

const TOKEN = 'pk.eyJ1IjoidGhvbTIzIiwiYSI6ImNreHE1dGlheTJla2syeXFrMDh6bWVubmMifQ.FJI_I_aW5GQakRPeLsfNjg';


export async function getCoords(address) {
  try {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${TOKEN}&limit=1`);
    return response;
  } catch (error) {
    console.log(error);
  }
}
