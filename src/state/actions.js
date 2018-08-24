import {
  findLocationByAddress,
  findLocationByLatLng,
  findCurrentLocation,
} from '../services/geocoder';

import {
  createLatLng,
  drawMiddleTarget,
  fitAllMarkers,
  addGoogleMarker,
  addMapInfoWindow,
} from '../services/google-maps';

import { findMidpoint } from '../services/midpoint';

const MIDPOINT_NAME = 'MIDPOINT';

export const ADD_LOCATION = 'ADD_LOCATION';
export const addLocation = (location) => ({ type: ADD_LOCATION, location });

export const SET_MIDPOINT_ID = 'SET_MIDPOINT_ID';
export const resetMidpointId = () => ({ type: SET_MIDPOINT_ID });

export const REMOVE_LOCATION = 'REMOVE_LOCATION';
export const removeLocation = (id) => ({ type: REMOVE_LOCATION, id });

export const addFriend = (name, address) => (dispatch, getState) => {
  findLocationByAddress(name, address)
    .then(location => dispatch(addMapMarker(location)))
    .then(details => dispatch(saveLocation(details)))
    .then(() => findMidpoint(getState().app.locations))
    .then(midpointLatLng => dispatch(addMidpoint(midpointLatLng)));
};

const addMidpoint = (midpointLatLng) => (dispatch, getState) => {
  const startingRadius = 0;
  const name = MIDPOINT_NAME;
  const resetMidpoint = true;

  midpointLatLng && findLocationByLatLng(name, midpointLatLng)
    .then(location => dispatch(addMapMarker(location)))
    .then(details => dispatch(saveLocation(details, resetMidpoint)))
    .then(() => drawMiddleTarget(startingRadius, getState().app.locations, getState().app.midpointId))
    .then(() => fitAllMarkers(getState().app.locations));
};

export const addCurrentLocation = () => (dispatch) => {
  findCurrentLocation()
    .then(latlng => findLocationByLatLng('You', latlng))
    .then(location => dispatch(addMapMarker(location)))
    .then(details => dispatch(saveLocation(details)));
};

const saveLocation = (details, resetMidpoint = false) => (dispatch, getState) => {
  if (resetMidpoint) {
    dispatch(removeMapMarker(getState().app.midpointId));
    dispatch(removeLocation(getState().app.midpointId));
    dispatch(resetMidpointId());
  }

  const item = {
    marker: details.marker,
    infoWindowContent: details.infoWindowContent,
    infoWindow: details.infoWindow,
    name: details.location.name,
    latitude: details.location.latitude,
    longitude: details.location.longitude,
    address: details.location.addresses[0].formatted_address,
    windowOpen: false,
    latLngObject: createLatLng(details.location.latitude, details.location.longitude),
    id: getState().app.id,
  };

  dispatch(addLocation(item));
};

const addMapMarker = (location) => (dispatch, getState) => {
  const latitude = location.latitude;
  const longitude = location.longitude;
  const address = location.addresses[0].formatted_address;
  // const suburb = location.addresses[0].address_components[1].long_name;

  const marker = addGoogleMarker(latitude, longitude, getState().app.id, getState);

  const infoWindowContent = `<div>${location.name}<br />${address}</div>`;
  const infoWindow = addMapInfoWindow(marker, infoWindowContent, getState);

  return {
    marker,
    infoWindowContent,
    infoWindow,
    location,
  };
};

const removeMapMarker = (id) => (dispatch, getState) => {
  const store = getState().app.locations;
  if (id > -1) {
    store[id]["marker"].setMap(null);
  }
};

export const getLocationById = (id, locations) => {
  for (let index=0; index<locations.length; index++) {
    if (locations[index]["id"] === id) {
      return locations[index];
    }
  }
};
