import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';

import appReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';

export default class App extends React.Component {
  render() {
    const middlewares = [];
    
    if (process.env.NODE_ENV === 'development') {
      const logger = createLogger({colors: 'none'});
      middlewares.push(logger);
    }
    
    const store = compose(applyMiddleware(...middlewares))(createStore)(appReducer);    

    return (
    <Provider store={store}>
      <AppWithNavigationState />
    </Provider>
    );
  }
}