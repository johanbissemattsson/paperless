import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { isFirstDayOfMonth, isSameWeek } from 'date-fns';
import { List, Map } from 'immutable';

export default class CalendarListWeek extends React.Component {
  render() {
    const { week, selected, children } = this.props;
    const isFirstWeekOfMonth = isFirstDayOfMonth(week.days.first());
    const isSelectedWeek = isSameWeek(selected, week.days.first());
    
    return (
      <View style={[styles.container, isFirstWeekOfMonth && styles.firstWeekOfMonth, isSelectedWeek && styles.selectedWeek]}>
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
  firstWeekOfMonth: {
    justifyContent: 'flex-end'
  },  
  selectedWeek: {
  },
});