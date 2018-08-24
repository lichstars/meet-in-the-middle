import {
  ADD_LOCATION,
  REMOVE_LOCATION,
  SET_MIDPOINT_ID,
} from './actions';

const defaultState = {
  locations: [],
  id: 0,
  midpointId: -1,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {

    case ADD_LOCATION: {
      const id = state.id + 1;
      const locations = Array.from(state.locations);

      locations.push(action.location);

      return Object.assign({}, state, { locations, id });
    }

    case SET_MIDPOINT_ID: {
      const id = state.id;
      return Object.assign({}, state, { midpointId: id });
    }

    case REMOVE_LOCATION: {
      const locations = Array.from(state.locations);

      if (action.id > -1) {
        locations.splice(action.id, 1);
      }

      return Object.assign({}, state, { locations });
    }

    default: {
      return state;
    }
  }
};

export default reducer;
