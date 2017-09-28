import { combineReducers } from 'redux';

import nav from './nav';
import months from './months';
import documents from './documents';
import camera from './camera';


const appReducer = combineReducers({
  nav,
  months,
  documents,
  camera
});

export default appReducer;
