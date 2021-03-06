import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, NavigationActions } from 'react-navigation';
import { BackHandler } from 'react-native';
import { Constants } from 'expo';

import MainScreen from '../containers/MainScreen';
import SettingsScreen from '../containers/SettingsScreen';
import ContextMenu from '../components/ContextMenu';

const routeConfigs = {
  Main: { 
    screen: MainScreen,
    navigationOptions: {
      headerStyle: {
        marginTop: Constants.statusBarHeight,
        position: 'absolute',
        top: 16,
        left: 0,
        right: 0,
        zIndex: 10000
      },
      headerRight: <ContextMenu />
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      headerStyle: {
        marginTop: Constants.statusBarHeight,
      }
    }
  },
};

const StackNavigatorConfig = {
  //headerMode: 'none'
  /*
  cardStyle:{
    backgroundColor: 'transparent',
    opacity: 1,
  }
  */
}

export const AppNavigator = StackNavigator(routeConfigs, StackNavigatorConfig);

class AppWithNavigationState extends React.Component {
    componentDidMount() {
      BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillUnmount() {
      BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    onBackPress = () => {
      const { dispatch, nav } = this.props;      
      if (nav.index === 0) {
        return false;
      }
      dispatch(NavigationActions.back());
      return true;
    }

    render() {
      const { dispatch, nav } = this.props;
      const navigation = addNavigationHelpers({ dispatch, state: nav });
      
      return (
        <AppNavigator navigation={navigation} />
      );
    }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
