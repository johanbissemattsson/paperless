import { Map } from 'immutable';

const initialState = Map({
  isCameraActivated: true,
});

export default documents = (state = initialState, action) => {
  switch (action.type) {         
    case 'Login':  
      return state.update('isCameraActivated', () => true);
    case 'Logout':
      return state.update('isCameraActivated', () => false);
    default:
      return state;
  }
}