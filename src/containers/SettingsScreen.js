import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    const { goBack, navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text>Detta är Settings</Text>
        <Button
          title="Go back"
          onPress={() => goBack()}
        />

        <Button
          title="Go to main"
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
