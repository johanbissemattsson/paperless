import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, PixelRatio } from 'react-native';

export default class CalendarListSpacer extends React.Component {
  render() {
    const { days, selectedDate, dayHeight } = this.props;

    return (
      <View style={[styles.container, {minHeight: dayHeight}]} />);
  }
}

CalendarListSpacer.propTypes = {
  dayHeight: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: 'red',
  }
});