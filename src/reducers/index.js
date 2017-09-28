import { combineReducers } from 'redux';

import nav from './nav';
import months from './months';
import documents from './documents';

const appReducer = combineReducers({
  nav,
  months,
  documents
});

export default appReducer;
