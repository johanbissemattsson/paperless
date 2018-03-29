import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, PixelRatio } from 'react-native';
import { isSameWeek, isSameMonth, isWithinRange, areRangesOverlapping, startOfMonth, endOfMonth, isEqual} from 'date-fns';
import { List, Map } from 'immutable';

import CalendarListDay from './CalendarListDay';

export default class CalendarListWeek extends React.Component {
  render() {
    const { week, height, onDatePress } = this.props;
    return (
      <View style={[styles.container, {minHeight: height}]}>
        {week.get('days').map((day, dayIndex) => 
          <CalendarListDay
            day={day}
            partOfSelectedWeek={week.get('isSelectedWeek')}
            height={height}
            onDatePress={onDatePress}
            key={dayIndex}
          />
        )}
      </View>
    );
    
    /*return (
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
    */
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
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  selectedWeek: {
    backgroundColor: 'transparent',
  },
});