import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, PixelRatio } from 'react-native';

export default class DocumentsViewSpacer extends React.Component {
  render() {
    const { days, selectedDate, dayHeight } = this.props;

    return (
      <View style={[styles.container]} />);
  }
}

DocumentsViewSpacer.propTypes = {
  dayHeight: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,0,0.5)',
    height: 100
  }
});