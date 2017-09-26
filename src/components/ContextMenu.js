import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Button, View, Text, Platform, ToolbarAndroid } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Constants } from 'expo';

const ContextMenu = ({ settingsScreen }) => (
  (Platform.OS === 'android') ?
    <ToolbarAndroid
      actions={[{title: 'Settings', show: 'never'},{title: 'Send feedback', show: 'never'},{title: 'Help', show: 'never'}]}
      onActionSelected={settingsScreen}
      style={styles.toolbar}
    />
  :
    null //add iOS fallback here
)

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  settingsScreen: () =>
    dispatch(NavigationActions.navigate({ routeName: 'Settings', user: 'aaa' })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);

const styles = StyleSheet.create({
  toolbar: {
    height: 64,
    width: 64,
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: Constants.statusBarHeight
  }
});