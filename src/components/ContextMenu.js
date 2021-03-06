import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Button, View, Text, Platform, ToolbarAndroid } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Constants } from 'expo';

const ContextMenu = ({ settingsScreen }) => (
  (Platform.OS === 'android') ?
    <View style={styles.container}>
      <ToolbarAndroid
        actions={[/*{title: 'Search', show: 'always'},*/{title: 'Refresh', show: 'never'}, {title: 'Settings', show: 'never'},{title: 'Help and feedback', show: 'never'}]}
        onActionSelected={settingsScreen}
        style={styles.toolbar}
      />
    </View>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    flex: 1,
    height: 128,
    width: 128,
  }
});