import {
  googleMap,
  googleDirectionService,
  googlePolyline,
  googleDirectionsRenderer,
  googleTravelMode,
  googleUnitSystem,
  googleDirectionStatus,
  googleDistanceMatrixService,
  createLatLng,
} from './google-maps';

export const findMidpoint = (store) => {
  if (!store || store.length < 2)
    return {};

  resetDrawnRoutes();

  if (store.length === 2) {
    return getDistanceBetweenTwo(store)
      .then(distanceDetails => attemptToDrawRoute(store, distanceDetails))
      .then(routeDetails => findMidpointForTwo(store, routeDetails.distance));
  } else {
    const midway = findMidpointForMany(store);
    return createLatLng(midway["x"], midway["y"]);
  }
};

const findMidpointForMany = (store) => {
  const locations = store;
  let centroid = [];
  let signedArea = 0.0;
  let x0 = 0.0; // Current vertex X
  let y0 = 0.0; // Current vertex Y
  let x1 = 0.0; // Next vertex X
  let y1 = 0.0; // Next vertex Y
  let a = 0.0;  // Partial signed area
  let i = 0;

  centroid["x"] = 0.0;
  centroid["y"] = 0.0;
  // For all vertices except last
  for (i=0; i<(store.length-1); i++) {
    x0 = locations[i]["latitude"];
    y0 = locations[i]["longitude"];
    x1 = locations[i+1]["latitude"];
    y1 = locations[i+1]["longitude"];
    a = x0*y1 - x1*y0;
    signedArea += a;
    centroid["x"] += (x0 + x1)*a;
    centroid["y"] += (y0 + y1)*a;
  }

  // Do last vertex
  x0 = locations[i]["latitude"];
  y0 = locations[i]["longitude"];
  x1 = locations[0]["latitude"];
  y1 = locations[0]["longitude"];
  a = x0*y1 - x1*y0;
  signedArea += a;
  centroid["x"] += (x0 + x1)*a;
  centroid["y"] += (y0 + y1)*a;

  signedArea *= 0.5;
  centroid["x"] /= (6.0*signedArea);
  centroid["y"] /= (6.0*signedArea);

  return centroid;
};

const findGeographicalMidpoint = (store) => {
  let centroid = [];
  const location1x = store[0]["latitude"];
  const location1y = store[0]["longitude"];
  const location2x = store[1]["latitude"];
  const location2y = store[1]["longitude"];

  centroid["x"] = (location1x + location2x) / 2;
  centroid["y"] = (location1y + location2y) / 2;

  return centroid;
};

const findDrivingDistanceMidpoint = (distance) => {
  return 0.5 * distance;
};

/*eslint-disable new-cap*/
const getDistanceBetweenTwo = (store) => {
  const distanceDetails = {
    origins: [store[0].latLngObject],
    destinations: [store[1].latLngObject],
    travelMode: googleTravelMode.DRIVING,
    unitSystem: googleUnitSystem.METRIC,
    durationInTraffic: true,
    avoidHighways: false,
    avoidTolls: false,
  };

  return new Promise((resolve) => new googleDistanceMatrixService.getDistanceMatrix(distanceDetails, (response) => resolve(response)));
};

const findMidpointForTwo = (store, distance) => {
  if (distance && distance.value > 0) {
    const midway = findDrivingDistanceMidpoint(distance.value);
    return new Promise(resolve => resolve(googlePolyline.GetPointAtDistance(midway)));
  } else {
    const midway = findGeographicalMidpoint(store);
    return new Promise(resolve => resolve(createLatLng(midway["x"], midway["y"])));
  }
};
/*eslint-enable max-depth, new-cap*/

const attemptToDrawRoute = (store, response) => {
  const result = response.rows[0].elements[0];

  const routeDetails = {
    duration: result.duration,
    distance: result.distance,
    origin: response.originAddresses[0],
    destination: response.destinationAddresses[0],
  };

  if (result.distance && result.distance.value > 0) {
    return drawDrivingRoute(store, routeDetails);
  }

  return routeDetails;
};

/*eslint-disable max-depth*/
const drawDrivingRoute = (store, routeDetails) => {
  googleDirectionsRenderer.setMap(googleMap);

  const request = {
    origin: routeDetails.origin,
    destination: routeDetails.destination,
    travelMode: googleTravelMode.DRIVING,
  };

  return new Promise(resolve => {
    googleDirectionService.route(request, (response, status) => {
      if (status === googleDirectionStatus.OK) {
        googlePolyline.setPath([]);
        googleDirectionsRenderer.setDirections(response);

        const legs = response.routes[0].legs;

        for (let i=0; i<legs.length; i++) {
          const steps = legs[i].steps;

          for (let j=0; j<steps.length; j++) {
            const nextSegment = steps[j].path;

            for (let k=0; k<nextSegment.length; k++) {
              googlePolyline.getPath().push(nextSegment[k]);
            }
          }
        }

        googlePolyline.setMap(googleMap);

        resolve(routeDetails);
      }
    });
  });
};
/*eslint-enable max-depth*/

export const resetDrawnRoutes = () => {
  if (googlePolyline) {
    googlePolyline.setPath([]);
    googlePolyline.visible = false;
    googlePolyline.setMap(null);
  }

  if (googlePolyline) {
    googleDirectionsRenderer.visible = false;
    googleDirectionsRenderer.setMap(null);
  }
};
