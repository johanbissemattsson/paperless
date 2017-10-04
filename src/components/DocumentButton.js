import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Button, View, Text, TouchableNativeFeedback, TouchableOpacity, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Constants } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';

import { LOGIN, LOGOUT, GO_TO } from '../actionTypes';

const DocumentButton = ({ logout, login, loginScreen, isCameraActivated, goTo }) => {
  _onPress = (e) => {goTo(new Date())};

  return (
    <View style={styles.container}>
      {(Platform.OS === 'android') ?
        <TouchableNativeFeedback onPress={_onPress} background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
          <View style={styles.button}>
            <MaterialIcons name='add' size={32} color='#8766ee' />
          </View>
        </TouchableNativeFeedback>
        :
        <TouchableHighlight onPress={isCameraActivated ? logout : login}>
          <View style={styles.button}>
            <MaterialIcons name='arrow-up' size={24} color='#ffffff' />
          </View>
        </TouchableHighlight>             
      }
    </View>
  )
}

DocumentButton.PropTypes = {
  logout: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  loginScreen: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  isCameraActivated: state.documents.get('isCameraActivated'),
});

const mapDispatchToProps = dispatch => ({
  goTo: (date) => dispatch({ type: GO_TO, date: date}),
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
    backgroundColor: '#fff',    
    elevation: 1,
    width: 64,
    height: 64,
    borderRadius: 64,    
    
  },
  button: {
    flex: 1,
    alignItems: 'center',    
    justifyContent: 'center',    
    alignSelf: 'stretch',
    borderWidth: 6,
    borderColor: '#ffffff',
    borderRadius: 64,
  }
});