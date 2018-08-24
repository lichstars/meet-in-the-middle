import {
  ADD_LOCATION,
  REMOVE_LOCATION,
  SET_MIDPOINT_BOUNDS,
  ADD_PLACE,
  RESET_PLACES,
} from './actions';

const defaultState = {
  locations: [],
  midpointBounds: null,
  places: [],
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {

    case ADD_LOCATION: {
      const locations = Array.from(state.locations);

      locations.push(action.location);

      return Object.assign({}, state, { locations });
    }

    case ADD_PLACE: {
      const places = Array.from(state.places);

      places.push(action.place);

      return Object.assign({}, state, { places });
    }

    case RESET_PLACES: {
      return Object.assign({}, state, { places: [] });
    }

    case SET_MIDPOINT_BOUNDS: {
      return Object.assign({}, state, { midpointBounds: action.bounds });
    }

    case REMOVE_LOCATION: {
      const locations = Array.from(state.locations);

      const index = locations.indexOf(action.item);

      if (index > -1) {
        locations.splice(index, 1);
      }

      return Object.assign({}, state, { locations });
    }

    default: {
      return state;
    }
  }
};

export default reducer;
