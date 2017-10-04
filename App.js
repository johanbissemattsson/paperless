import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger';

import appReducer from './src/reducers';
import appSaga from './src/sagas';
import AppWithNavigationState from './src/navigators/AppNavigator';

export default class App extends React.Component {
  render() {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];
    
    if (process.env.NODE_ENV === 'development') {
      const logger = createLogger({colors: 'none'});
      middlewares.push(logger);
    }
    
    const store = compose(applyMiddleware(...middlewares))(createStore)(appReducer);    
    sagaMiddleware.run(appSaga);

    return (
    <Provider store={store}>
      <AppWithNavigationState />
    </Provider>
    );
  }
}