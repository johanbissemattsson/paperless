import { Map } from 'immutable';

const initialState = Map({
  isCameraActivated: true,
});

export default camera = (state = initialState, action) => {
  switch (action.type) {         
    case 'ActivateCamera':  
      return state.update('isCameraActivated', () => true);
    case 'DeactivateCamera':
      return state.update('isCameraActivated', () => false);
    default:
      return state;
  }
}