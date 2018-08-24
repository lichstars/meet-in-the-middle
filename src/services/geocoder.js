import {
  googleGeocoder,
  createLatLng,
  googleGeocoderStatus,
} from './google-maps';

export const findLocationByAddress = (name, address) => {
  return new Promise((resolve) => {
    googleGeocoder.geocode({ 'address': address }, (results, status) => {
      if (status === googleGeocoderStatus.OK) {
        resolve({
          name: name,
          addresses: results,
          latitude: results[0].geometry.location.lat(),
          longitude: results[0].geometry.location.lng(),
        });
      } else {
        console.log('Couldnt find location by address because: ', status);
      }
    });
  });
};

export const findLocationByLatLng = (name, latLng) => {
  return new Promise((resolve) => {
    googleGeocoder.geocode({ 'latLng': latLng }, (results, status) => {
      if (status === googleGeocoderStatus.OK) {
        if (results.length > 0) {
          resolve({
            name: name,
            addresses: results,
            latitude: latLng.lat(),
            longitude: latLng.lng(),
          });
        }
      } else {
        console.log('Couldnt find location by LatLng because: ', status);
      }
    });
  });
};

export const findCurrentLocation = () => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const latlng = createLatLng(position.coords.latitude, position.coords.longitude);
        resolve(latlng);
      });
    }
  });
};
