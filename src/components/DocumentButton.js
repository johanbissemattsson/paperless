import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Button, View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Constants } from 'expo';

const DocumentButton = ({ logout, login, loginScreen, isCameraActivated }) => (
  <View style={styles.container}>
    <Button
      title={isCameraActivated ? 'Take photo' : 'Add document'}
      onPress={isCameraActivated ? logout : login}
    />
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
  logout: () => dispatch({ type: 'Logout' }),
  login: () => dispatch({ type: 'Login' }),
  loginScreen: () =>
    dispatch(NavigationActions.navigate({ routeName: 'Settings', user: 'aaa' })),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentButton);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    marginBottom: Constants.statusBarHeight
  }
});