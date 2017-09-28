import { Map } from 'immutable';

const initialDocumentsState = Map({
  isCameraActivated: true,
});

export default documents = (state = initialDocumentsState, action) => {
  switch (action.type) {         
    case 'Login':  
      return state.update('isCameraActivated', () => true)            
    case 'Logout':
      return state.update('isCameraActivated', () => false)            
    default:
      return state;
  }
}