import React from 'react';
import { StyleSheet, Text, View, Button, Platform, ToolbarAndroid  } from 'react-native';
import { Constants } from 'expo';

import DocumentButton from './DocumentButton';

export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Main Screen',
  };

  onActionSelected = (position) => {
    const { navigate } = this.props.navigation;
    console.log(position);
    if (position === 0) { // index of 'Settings'
      navigate('Settings');
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <DocumentButton />
        <Text>Detta är main screen</Text>
        {(Platform.OS === 'android') ?
          <ToolbarAndroid
            actions={[{title: 'Settings', show: 'never'},{title: 'Send feedback', show: 'never'},{title: 'Help', show: 'never'}]}
            onActionSelected={this.onActionSelected}
            style={styles.toolbar}
          />
        :
        null //add iOS fallback here
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9900',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    height: 64,
    width: 64,
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: Constants.statusBarHeight
  }
});
