import { Map } from 'immutable';

const initialState = Map({
  mode: {
    camera: true,
    scroll: false,
  },
});

export default documentButton = (state = initialState, action) => {
  switch (action.type) {         
    case 'aaa':  
      return state.set('mode', () => ({
        camera: true,
        scroll: false
      }))
      case 'aaa':  
      return state.set('mode', () => ({
        camera: false,
        scroll: true
      }))
    default:
      return state;
  }
}