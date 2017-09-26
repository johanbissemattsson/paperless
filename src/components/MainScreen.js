import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Constants } from 'expo';

import DocumentButton from './DocumentButton';
import ContextMenu from './ContextMenu';


export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Main Screen',
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <DocumentButton />
        <Text>Detta är main screen</Text>
        <ContextMenu />
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
  }
});
