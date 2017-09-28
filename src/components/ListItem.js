import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class ListItem extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.id}</Text>
      </View>
    );
  }
}

ListItem.propTypes = {
  id: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 300
  }
});