import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';

const DocumentButton = ({ logout, login, loginScreen, isCameraActivated }) => (
  <Button
    title={isCameraActivated ? 'Take photo' : 'Add document'}
    onPress={isCameraActivated ? logout : login}
  />
)

DocumentButton.PropTypes = {
  isCameraActivated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  loginScreen: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  isCameraActivated: state.documents.isCameraActivated,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  login: () => dispatch({ type: 'Login' }),
  loginScreen: () =>
    dispatch(NavigationActions.navigate({ routeName: 'Settings', user: 'aaa' })),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentButton);