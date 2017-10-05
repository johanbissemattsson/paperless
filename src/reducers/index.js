import { combineReducers } from 'redux';

import nav from './nav';
import calendar from './calendar';
import documents from './documents';
import camera from './camera';
import documentButton from './documentButton';

const appReducer = combineReducers({
  nav,
  calendar,
  documents,
  camera,
  documentButton
});

export default appReducer;
