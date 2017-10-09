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
    borderTopWidth: 1,
    borderTopColor: "#573399",
    alignSelf: 'stretch', 
  }
});