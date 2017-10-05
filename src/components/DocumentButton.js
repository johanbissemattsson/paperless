import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Button, View, Text, TouchableNativeFeedback, TouchableOpacity, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Constants } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';

import { LOGIN, LOGOUT } from '../actionTypes';

class DocumentButton extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }
  
  render() {
    const { onPress} = this.props;

    return (
    <View style={styles.container}>
      {(Platform.OS === 'android') ?
        <TouchableNativeFeedback onPress={onPress} background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
          <View style={styles.button}>
            <MaterialIcons name='add' size={32} color='#8766ee' />
          </View>
        </TouchableNativeFeedback>
        :
        <TouchableHighlight onPress={onPress}>
          <View style={styles.button}>
            <MaterialIcons name='arrow-up' size={24} color='#ffffff' />
          </View>
        </TouchableHighlight>             
      }
    </View>      
    );
  }
}

DocumentButton.PropTypes = {
  logout: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  loginScreen: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired
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