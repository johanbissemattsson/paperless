import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, PixelRatio } from 'react-native';
import { isSameWeek, isSameMonth, isWithinRange, areRangesOverlapping, startOfMonth, endOfMonth, isEqual} from 'date-fns';
import { List, Map } from 'immutable';

import CalendarListDay from './CalendarListDay';

export default class CalendarListWeek extends React.Component {
  constructor(props, context) {
    super(props, context);

    const { days, selectedDate, weekStartsOn } = props;
    this.state = {
      weekIsSameWeekAsSelectedDate: isWithinRange(selectedDate, days.first(), days.last()),
      weekIsSameMonthAsSelectedDate: areRangesOverlapping(days.first(), days.last(), startOfMonth(selectedDate), endOfMonth(selectedDate))
    };
  }

  shouldComponentUpdate(nextProps, nextState) { 
    const { id, days, selectedDate, shouldRenderWeeks, weekStartsOn } = this.props;
    const { weekIsSameWeekAsSelectedDate, weekIsSameMonthAsSelectedDate } = this.state;

    const nextWeekIsSameWeekAsSelectedDate = isWithinRange(nextProps.selectedDate, nextProps.days.first(), nextProps.days.last());
    const nextWeekIsSameMonthAsSelectedDate = areRangesOverlapping(nextProps.days.first(), nextProps.days.last(), startOfMonth(nextProps.selectedDate), endOfMonth(nextProps.selectedDate));

    /*
    nextWeekIsSameWeekAsSelected && console.log('nextWeekIsSameWeekAsSelected', nextWeekIsSameWeekAsSelected);
    nextWeekIsSameMonthAsSelected && console.log('nextWeekIsSameMonthAsSelected', nextWeekIsSameMonthAsSelected);
    weekIsSameWeekAsSelected && console.log('weekIsSameWeekAsSelected', weekIsSameWeekAsSelected);
    weekIsSameMonthAsSelected && console.log('weekIsSameMonthAsSelected', weekIsSameMonthAsSelected);
    */

    if ((selectedDate !== nextProps.selectedDate) && (nextWeekIsSameWeekAsSelectedDate || nextWeekIsSameMonthAsSelectedDate || weekIsSameWeekAsSelectedDate || weekIsSameMonthAsSelectedDate)) {
      return true;
    } else {
      return false;
    }
  };

  componentDidUpdate () {
    const { days, selectedDate, dayHeight, onDatePress, weekStartsOn } = this.props;

    this.setState({
      weekIsSameWeekAsSelectedDate: isWithinRange(selectedDate, days.first(), days.last()),
      weekIsSameMonthAsSelectedDate: areRangesOverlapping(days.first(), days.last(), startOfMonth(selectedDate), endOfMonth(selectedDate))
    });
  }

  render() {
    const { days, selectedDate, dayHeight, onDatePress, weekStartsOn } = this.props;

    return (
      <View style={[styles.container, {minHeight: dayHeight}]}>
        {days.map((day, dayIndex) => {
          const dayIsSameWeekAsSelectedDate = isSameWeek(day, selectedDate, {weekStartsOn: weekStartsOn});
          const dayIsSameMonthAsSelectedDate = isSameMonth(day, selectedDate);

          return (
            <CalendarListDay
              day={day}
              selected={isEqual(day, selectedDate)}
              dayIsSameWeekAsSelectedDate={dayIsSameWeekAsSelectedDate}
              dayIsSameMonthAsSelectedDate={dayIsSameMonthAsSelectedDate}
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
  selectedDate: PropTypes.PropTypes.string.isRequired,
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