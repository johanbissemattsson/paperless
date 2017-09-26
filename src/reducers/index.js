import { combineReducers } from 'redux';

import nav from './nav';
import documents from './documents';

const appReducer = combineReducers({
  nav,
  documents
});

export default appReducer;
