import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, PixelRatio } from 'react-native';
import { isSameWeek } from 'date-fns';
import { List, Map } from 'immutable';

export default class CalendarListWeek extends React.Component {
  componentDidUpdate() {
    const { week, selected, updateActiveCalendarListWeek } = this.props;

    if (this.refCalendarListWeek && week.days.includes(selected)) {
      updateActiveCalendarListWeek(this.refCalendarListWeek);
    }
  }

  render() {
    const { week, selected, children } = this.props;
    const isSelectedWeek = isSameWeek(selected, week.days.first());
    
    return (
      <View style={[styles.container, isSelectedWeek && styles.selectedWeek]} collapsable={!isSelectedWeek} ref={node => {this.refCalendarListWeek = node}}>
        {children}
      </View>
    );
  }
}

CalendarListWeek.propTypes = {
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  children: PropTypes.node.isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  selectedWeek: {
  },
});