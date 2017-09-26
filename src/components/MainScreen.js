import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import DocumentButton from './DocumentButton';

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
        <Button
          title="Settings"
          onPress={() => navigate('Settings')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
