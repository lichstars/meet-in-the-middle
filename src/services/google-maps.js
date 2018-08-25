import { RADIUS, MAPTYPE_ID } from '../constants/maps';
import { getLocationById } from '../state/actions';

const google = window.google;
export const googleDirectionService = new google.maps.DirectionsService();
export const googleGeocoder = new google.maps.Geocoder();
export const googlePolyline = new google.maps.Polyline({ path: [], strokeColor: '#FF0000', strokeWeight: 3 });
export const googleDirectionsRenderer = new google.maps.DirectionsRenderer({ suppressInfoWindows: true, suppressMarkers:true });
export const googleDistanceMatrixService = new google.maps.DistanceMatrixService();
export const googleTravelMode = google.maps.DirectionsTravelMode;
export const googleUnitSystem = google.maps.UnitSystem;
export const googleDirectionStatus = google.maps.DirectionsStatus;
export const googleGeocoderStatus = google.maps.GeocoderStatus;
export const googlePlacesServiceStatus = google.maps.places.PlacesServiceStatus;
export let googlePlacesService;
export let googleMap;

export const addressAutoComplete = () => {
  new google.maps.places.Autocomplete((document.getElementById('formAddress')),{ types: ['geocode'] });
};

google.maps.Polyline.prototype.GetPointAtDistance = (metres) => {
  if (metres === 0)
    return googlePolyline.getPath().getAt(0);
  if (metres < 0)
    return null;
  if (googlePolyline.getPath().getLength() < 2)
    return null;

  let dist = 0;
  let olddist = 0;
  let i = 1;

  for (i=1; (i < googlePolyline.getPath().getLength() && dist < metres); i++)
  {
    olddist = dist;
    dist += google.maps.geometry.spherical.computeDistanceBetween(
      googlePolyline.getPath().getAt(i),
      googlePolyline.getPath().getAt(i-1)
    );
  }
  if (dist < metres)
    return null;

  const p1 = googlePolyline.getPath().getAt(i-2);
  const p2 = googlePolyline.getPath().getAt(i-1);
  const m  = (metres-olddist)/(dist-olddist);

  return new google.maps.LatLng( p1.lat() + (p2.lat()-p1.lat())*m, p1.lng() + (p2.lng()-p1.lng())*m);
};

export const setupMap = (address) => {
  googleGeocoder.geocode( { 'address': address }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK) {
      const featureOpts = [
        {
          "featureType":"water",
          "stylers":[{ "visibility":"on" }, { "color":"#acbcc9" }],
        },
        {
          "featureType":"landscape",
          "stylers":[{ "color":"#f2e5d4" }],
        },
        {
          "featureType":"road.highway",
          "elementType":"geometry",
          "stylers":[{ "color":"#c5c6c6" }],
        },
        {
          "featureType":"road.arterial",
          "elementType":"geometry",
          "stylers":[{ "color":"#e4d7c6" }],
        },
        {
          "featureType":"road.local",
          "elementType":"geometry",
          "stylers":[{ "color":"#fbfaf7" }],
        },
        {
          "featureType":"poi.park",
          "elementType":"geometry",
          "stylers":[{ "color":"#c5dac6" }],
        },
        {
          "featureType":"administrative",
          "stylers":[{ "visibility":"on" }, { "lightness": 33 }],
        },
        {
          "featureType":"road",
        },
        {
          "featureType":"poi.park",
          "elementType":"labels",
          "stylers":[{ "visibility":"on" },{ "lightness": 20 }],
        },
        {},
        {
          "featureType":"road",
          "stylers":[{ "lightness": 20 }],
        }];

      const mapOptions = {
        zoom: 10,
        zoomControl: true,
        scrollwheel: true,
        center: results[0].geometry.location,
        disableDefaultUI: false,
        mapTypeId: MAPTYPE_ID,
        scaleControl: true,
      };

      googleMap = new google.maps.Map(document.getElementById("map"), mapOptions);

      googlePlacesService = new google.maps.places.PlacesService(googleMap);

      const styledMapOptions = { name: 'map' };

      const customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

      googleMap.mapTypes.set(MAPTYPE_ID, customMapType);

      googleMap.panTo(results[0].geometry.location);
    }
  });
};

export const addGoogleMarker = (lat, lng, index, getState) => {
  const marker = new google.maps.Marker({
    map: googleMap,
    position: new google.maps.LatLng(lat, lng),
    clickable: true,
    infoWindowIndex: index,
  });

  addMapMarkerListener(marker, getState);

  return marker;
};

const addMapMarkerListener = (marker, getState) => {
  marker.addListener('mouseover', () => {
    const item = getLocationById(marker.infoWindowIndex, getState().app.locations);
    const infoWindow = item.infoWindow;

    if (item.windowOpen === false) {
      infoWindow.open(googleMap, marker);
      item.windowOpen = true;
    }
  });
};

export const addMapInfoWindow = (marker, content, getState) => {
  const infoWindow = new google.maps.InfoWindow({ content: content });

  addInfoWindowListener(infoWindow, marker, getState);

  return infoWindow;
};

const addInfoWindowListener = (infoWindow, marker, getState) => {
  infoWindow.addListener('closeclick', () => {
    const item = getLocationById(marker.infoWindowIndex, getState().app.locations);
    item.windowOpen = false;
    infoWindow.close();
  });
};

let redRings;
let blueRings;
let whiteRings;

export const drawMidpointRings = (midpoint, radius = 0) => {
  const blueRingRadius = (RADIUS + radius) * 3.5;
  const redRingRadius = RADIUS + radius;
  const whiteRingRadius = (RADIUS + radius) * 2;

  clearCircles();

  blueRings = createCircle(blueRingRadius, midpoint.latLngObject, googleMap, 'cornflowerblue', 0.4);
  whiteRings = createCircle(whiteRingRadius, midpoint.latLngObject, googleMap, 'white', 0.4);
  redRings = createCircle(redRingRadius, midpoint.latLngObject, googleMap, 'crimson', 0.3);

  blueRings.setMap(googleMap);
  whiteRings.setMap(googleMap);
  redRings.setMap(googleMap);

  return blueRings.getBounds();
};

const clearCircles = () => {
  if (redRings !== undefined && redRings !== null) {
    redRings.setMap(null);
  }

  if (blueRings !== undefined && blueRings !== null) {
    blueRings.setMap(null);
  }

  if (whiteRings !== undefined && whiteRings !== null) {
    whiteRings.setMap(null);
  }
};

const createCircle = (radius, latlng, map, color, fillOpacity) => {
  return new google.maps.Circle({
    center: latlng,
    radius: radius,
    strokeColor: 'slategray',
    strokeOpacity: 0.8,
    strokeWeight: 0.8,
    fillColor: color,
    fillOpacity: fillOpacity,
    map: map,
  });
};

export const fitAllMarkers = (locations) => {
  const bounds = new google.maps.LatLngBounds();

  locations.forEach(location => bounds.extend(location.latLngObject));

  zoomToBound(bounds);
};

export const removeMapMarker = (item) => {
  item.marker.setMap(null);
};

export const zoomToBound = (point) => {
  googleMap.fitBounds(point);
};

export const zoomToLatLng = (location) => {
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(location.latLngObject);
  googleMap.fitBounds(bounds);
};

export const createLatLng = (latitude, longitude) => {
  return new google.maps.LatLng(latitude, longitude);
};
