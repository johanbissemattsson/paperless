import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Button, View, Text, TouchableNativeFeedback, TouchableOpacity, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Constants } from 'expo';

import { LOGIN, LOGOUT } from '../actionTypes';

const DocumentButton = ({ logout, login, loginScreen, isCameraActivated }) => (
  <View style={styles.container}>
    {(Platform.OS === 'android') ?
      <TouchableNativeFeedback onPress={isCameraActivated ? logout : login} background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
        <View style={styles.button} />
      </TouchableNativeFeedback>
      :
      <TouchableHighlight onPress={isCameraActivated ? logout : login}>
        <View style={styles.button} />
      </TouchableHighlight>             
    }
  </View>
)

DocumentButton.PropTypes = {
  logout: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  loginScreen: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  isCameraActivated: state.documents.get('isCameraActivated'),
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: LOGOUT }),
  login: () => dispatch({ type: LOGIN }),
  loginScreen: () =>
    dispatch(NavigationActions.navigate({ routeName: 'Settings', user: 'aaa' })),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentButton);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    marginBottom: Constants.statusBarHeight,
    flex: 1,
    alignItems: 'center',    
    justifyContent: 'center',
    backgroundColor: '#8766ee',    
    elevation: 1,
    width: 72,
    height: 72,
    borderRadius: 72,    
    
  },
  button: {
    flex: 1,
    alignSelf: 'stretch',
    borderWidth: 6,
    borderColor: '#ffffff',
    borderRadius: 72,
  }
});