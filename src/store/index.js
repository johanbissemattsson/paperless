import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import appReducer from '../reducers';

export default configureStore( (preloadedState) =>  {
  const logger = createLogger();
    
  return createStore(
    appReducer,
    preloadedState,
    applyMiddleware(
      thunk,
      logger
    )
  )
})