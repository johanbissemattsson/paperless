import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, PixelRatio } from 'react-native';
import { isSameWeek, isSameMonth } from 'date-fns';
import { List, Map } from 'immutable';

import CalendarListDay from './CalendarListDay';

export default class CalendarListWeek extends React.Component {
  shouldComponentUpdate(nextProps, nextState) { 
    const { id, selected, shouldRenderWeeks, weekStartsOn } = this.props;
    const wasSameWeekAsSelected = isSameWeek(id, selected, {weekStartsOn: weekStartsOn});
    const willBeSameWeekAsSelected = isSameWeek(nextProps.id, nextProps.selected, {weekStartsOn: weekStartsOn});
    if ((wasSameWeekAsSelected || willBeSameWeekAsSelected) && selected !== nextProps.selected) {
      return true;
    } else {
      return false;
    }
  };

  componentDidUpdate() {
    const { week, selected, updateActiveCalendarListWeek } = this.props;

    /*if (this.refCalendarListWeek && week.days.includes(selected)) {
      updateActiveCalendarListWeek(this.refCalendarListWeek);
    }*/
  }

  render() {
    const { days, selected, dayHeight, onDatePress, weekStartsOn } = this.props;

    return (
      <View style={[styles.container, {minHeight: dayHeight}]}>
        {days.map((day, dayIndex) => {
          const isSameMonthAsSelected = isSameMonth(day, selected);
          const isSameWeekAsSelected = isSameWeek(day, selected, {weekStartsOn: weekStartsOn});
          return (
            <CalendarListDay
              day={day}
              selected={selected}
              sameMonthAsSelected={isSameMonthAsSelected}
              sameWeekAsSelected={isSameWeekAsSelected}
              dayHeight={dayHeight}
              onDatePress={onDatePress}
              key={dayIndex}/>
          )
        })}
      </View>
    );
  }
}

CalendarListWeek.propTypes = {
  days: PropTypes.instanceOf(List).isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  dayHeight: PropTypes.number.isRequired,
  weekStartsOn: PropTypes.number.isRequired,
  onDatePress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  selectedWeek: {
    backgroundColor: 'transparent',
  },
});