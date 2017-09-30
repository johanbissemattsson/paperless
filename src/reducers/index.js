import { combineReducers } from 'redux';

import nav from './nav';
import calendar from './calendar';
import documents from './documents';
import camera from './camera';

const appReducer = combineReducers({
  nav,
  calendar,
  documents,
  camera
});

export default appReducer;
