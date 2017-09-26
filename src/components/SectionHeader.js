import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Button } from 'react-native';


export default class SectionHeader extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.title}</Text>
      </View>
    );
  }
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00ff00',
    padding: 8,
    borderRadius: 100
  }
});
