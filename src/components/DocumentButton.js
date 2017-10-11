import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Button, View, Text, TouchableNativeFeedback, TouchableOpacity, Platform, Dimensions } from 'react-native';
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
    const { onPress, cameraBusy } = this.props;
    const marginBottom = Dimensions.get('window').width / 7;

    return (
    <View style={[styles.container, {marginBottom: marginBottom + 4 }]}>
      {(Platform.OS === 'android') ?
        <TouchableNativeFeedback onPress={onPress} background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
          <View style={[styles.button, cameraBusy && {backgroundColor: '#8766ee'}]}>
            {cameraBusy ?
              <MaterialIcons name='more-horiz' size={24} color='#fff' />
                :
              <MaterialIcons name='add' size={32} color='#8766ee' />
            }
          </View>
        </TouchableNativeFeedback>
        :
        <TouchableHighlight onPress={onPress}>
          <View style={[styles.button, cameraBusy && {backgroundColor: '#8766ee'}]}>
            {cameraBusy ?
              <MaterialIcons name='more-horiz' size={24} color='#fff' />
                :
              <MaterialIcons name='add' size={32} color='#8766ee' />
            }
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
    flex: 1,
    alignItems: 'center',    
    justifyContent: 'center',
    backgroundColor: '#fff',    
    elevation: 1,
    width: 64,
    height: 64,
    borderRadius: 64,
    zIndex: 100
    
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