import {
  findLocationByAddress,
  findLocationByLatLng,
  findCurrentLocation,
} from '../services/geocoder';

import {
  createLatLng,
  drawMidpointRings,
  fitAllMarkers,
  addGoogleMarker,
  addMapInfoWindow,
  zoomToBound,
  zoomToLatLng,
  removeMapMarker,
  resetMidpointRings,
} from '../services/google-maps';

import {
  searchGooglePlaces,
  addPlaceMarker,
  getPlaceDetails,
  addPlaceInfoWindow,
} from '../services/google-places';

import { findMidpoint, resetDrawnRoutes } from '../services/midpoint';
import { RADIUS } from '../constants/maps';

const MIDPOINT_NAME = 'MIDPOINT';

export const ADD_LOCATION = 'ADD_LOCATION';
export const addLocation = (location) => ({ type: ADD_LOCATION, location });

export const ADD_PLACE = 'ADD_PLACE';
export const addPlace = (place) => ({ type: ADD_PLACE, place });

export const RESET_PLACES = 'RESET_PLACES';
export const resetPlaces = () => ({ type: RESET_PLACES });

export const REMOVE_LOCATION = 'REMOVE_LOCATION';
export const removeLocation = (item) => ({ type: REMOVE_LOCATION, item });

export const SET_MIDPOINT_BOUNDS = 'SET_MIDPOINT_BOUNDS';
export const setMidpointBounds = (bounds) => ({ type: SET_MIDPOINT_BOUNDS, bounds });

export const addFriend = (name, address) => (dispatch, getState) => {
  findLocationByAddress(name, address)
    .then(location => dispatch(saveAndMarkLocation(location)))
    .then(() => findMidpoint(getState().app.locations))
    .then(midpointLatLng => dispatch(addMidpoint(midpointLatLng)));
};

const addMidpoint = (midpointLatLng) => (dispatch, getState) => {
  const name = MIDPOINT_NAME;
  const isMidpoint = true;

  Object.keys(midpointLatLng).length > 0 && findLocationByLatLng(name, midpointLatLng)
    .then(location => dispatch(saveAndMarkLocation(location, isMidpoint)))
    .then(() => drawMidpointRings(getMidpointLocation(getState().app.locations)))
    .then((midpointBounds) => dispatch(setMidpointBounds(midpointBounds)))
    .then(() => fitAllMarkers(getState().app.locations));
};

export const addCurrentLocation = () => (dispatch) => {
  findCurrentLocation()
    .then(latlng => findLocationByLatLng('You', latlng))
    .then(location => dispatch(saveAndMarkLocation(location)));
};

export const searchPlaces = () => (dispatch, getState) => {
  const midpoint = getMidpointLocation(getState().app.locations);
  const types = ['restaurant'];

  dispatch(clearPreviousSearchResults());

  searchGooglePlaces(types, midpoint, RADIUS)
    .then((places) => {
      dispatch(saveAndMapPlaces(places));
    });
};

const resetMidpointOnMap = () => (dispatch, getState) => {
  const midpoint = getMidpointLocation(getState().app.locations);

  if (midpoint) {
    removeMapMarker(midpoint);
    dispatch(clearPreviousSearchResults());
    dispatch(removeLocation(midpoint));
  }
};

const saveAndMarkLocation = (location, isMidpoint = false) => (dispatch, getState) => {
  const id = getState().app.locations.length;

  if (isMidpoint) {
    dispatch(resetMidpointOnMap());
  }

  const latitude = location.latitude;
  const longitude = location.longitude;
  const address = location.addresses[0].formatted_address;
  const marker = addGoogleMarker(latitude, longitude, id, getState);
  const infoWindowContent = `<div>${location.name}<br />${address}</div>`;
  const infoWindow = addMapInfoWindow(marker, infoWindowContent, getState);

  const item = {
    marker: marker,
    infoWindowContent: infoWindowContent,
    infoWindow: infoWindow,
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    address: location.addresses[0].formatted_address,
    windowOpen: false,
    latLngObject: createLatLng(location.latitude, location.longitude),
    id: id,
    isMidpoint: isMidpoint,
  };

  dispatch(addLocation(item));
};

const saveAndMapPlaces = (places) => (dispatch, getState) => {
  places.forEach((place, id) => {
    getPlaceDetails(place).then(details => {
      const marker = addPlaceMarker(place.geometry.location, id, getState);
      const content = `<div>${place.name}</div>`;
      const infoWindow = addPlaceInfoWindow(marker, content, getState);

      const aPlace = {
        id: id,
        place: place,
        marker: marker,
        location: place.geometry.location,
        details: details,
        windowOpen: false,
        clicked: false,
        infoWindowContent: content,
        infoWindow: infoWindow,
      };

      dispatch(addPlace(aPlace));
    });
  });
};

const clearPreviousSearchResults = () => (dispatch, getState) => {
  getState().app.places.forEach(place => {
    removeMapMarker(place);
  });

  dispatch(resetPlaces());
};

export const removeAndRecalculate = (location) => (dispatch, getState) => {
  removeMapMarker(location);
  dispatch(removeLocation(location));

  dispatch(resetMidpointOnMap());

  resetDrawnRoutes();

  resetMidpointRings();

  if (getState().app.locations.length > 1) {
    findMidpoint(getState().app.locations)
      .then(midpointLatLng => dispatch(addMidpoint(midpointLatLng)))
  }
};

export const getLocationById = (id, locations) => {
  const results = locations.filter(location => location.id === id);
  if (results.length > 0) {
    return results[0];
  }
  return null;
};

export const getMidpointLocation = (locations) => {
  const midpointArray = locations.filter(location => location.isMidpoint === true);
  if (midpointArray.length > 0) {
    return midpointArray[0];
  }
  return null;
};

export const zoomToMidpoint = () => (dispatch, getState) => {
  zoomToBound(getState().app.midpointBounds);
};

export const zoomToLocation = (location) => {
  zoomToLatLng(location);
};
