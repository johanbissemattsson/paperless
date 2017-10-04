import { Map } from 'immutable';

import { LOGIN, LOGOUT } from '../actionTypes';

const initialState = Map({
  isCameraActivated: true,
});

export default documents = (state = initialState, action) => {
  switch (action.type) {         
    case LOGIN:
      return state.update('isCameraActivated', () => true);
    case LOGOUT:
      return state.update('isCameraActivated', () => false);
    default:
      return state;
  }
}