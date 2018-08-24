import {
  googleMap,
  googlePlacesService,
  googlePlacesServiceStatus,
  drawMidpointRings,
} from './google-maps';
import { getLocationById } from '../state/actions';

const google = window.google;

let searchRadiusMultiplier = 1;

export const searchGooglePlaces = (type, midpoint, radius) => {
  const request = {
    location: midpoint.latLngObject,
    type: type,
    radius: radius,
  };

  drawMidpointRings(midpoint, radius);

  return new Promise((resolve) => {
    googlePlacesService.nearbySearch(request, (results, status) => {
      if (status === googlePlacesServiceStatus.OK) {
        resolve(results);
      }

      if (status === googlePlacesServiceStatus.ZERO_RESULTS & radius <= 50000) {
        radius = radius + (500 * searchRadiusMultiplier);
        searchRadiusMultiplier++;
        resolve(searchGooglePlaces(type, midpoint, radius));
      }
    });
  });
};

export const getPlaceDetails = (place) => {
  return new Promise((resolve) => {
    googlePlacesService.getDetails(place, (result, status) => {
      if (status === googlePlacesServiceStatus.OVER_QUERY_LIMIT) {
        setTimeout(() => {
          resolve(getPlaceDetails(place));
        }, 500);
      }
      if (status === googlePlacesServiceStatus.OK) {
        resolve(result);
      }
    });
  });
};

export const addPlaceMarker = (place, id, getState) => {
  const marker = new google.maps.Marker ({
    map: googleMap,
    position: place,
    infoWindowIndex : id,
    icon: {
      path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
      fillColor: '#ffff00',
      fillOpacity: 1,
      scale: 1/4,
      strokeColor: '#bd8d2c',
      strokeWeight: 1,
    },
  });

  marker.addListener('click', () => {
    const item = getLocationById(marker.infoWindowIndex, getState().app.places);
    const infoWindow = item.infoWindow;

    if (item.windowOpen === false) {
      infoWindow.open(googleMap, marker);
      item.windowOpen = true;
    }
  });

  return marker;
};

export const addPlaceInfoWindow = (marker, content, getState) => {
  const infoWindow = new google.maps.InfoWindow({ content: content });

  infoWindow.addListener('closeclick', () => {
    const item = getLocationById(marker.infoWindowIndex, getState().app.places);
    item.windowOpen = false;
    infoWindow.close();
  });

  return infoWindow;
};
