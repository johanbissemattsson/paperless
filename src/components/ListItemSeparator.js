import React from 'react';
import { StyleSheet, View } from 'react-native';

export default class ListItemSeparator extends React.Component {
  render() {
    return (
      <View style={styles.container} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    borderTopWidth: 1,
    borderTopColor: "#ff0000",
    alignSelf: 'stretch', 
  }
});