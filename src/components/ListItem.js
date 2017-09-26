import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class ListItem extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.month}</Text>
      </View>
    );
  }
}

ListItem.propTypes = {
  month: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    alignItems: 'center',
  }
});