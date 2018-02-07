import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableNativeFeedback, Platform} from 'react-native';
import { format, isEqual, isPast, isToday, isSameMonth, isSameWeek } from 'date-fns';

export default class CalenderListDay extends React.Component { 
  render() {
    const { day, selected, dayHeight, onDatePress, updateSelectedRef, dayIsSameWeekAsSelectedDate, dayIsSameMonthAsSelectedDate  } = this.props;
    
    return (
      <View style={[styles.container, selected && styles.selectedContainer, !selected && dayIsSameMonthAsSelectedDate && styles.selectedMonth ]} ref={node => {this.refCalendarListDay = node}}>
        <TouchableNativeFeedback onPress={((e) => onDatePress(day))} background={TouchableNativeFeedback.SelectableBackground()} >
          <View style={[styles.day, {height: dayHeight}]}>
            <Text style={[styles.date, (selected && styles.selectedDate)]}>{format(day,'D')}</Text>
          </View>
        </TouchableNativeFeedback> 
      </View>
    );
  }
}

CalenderListDay.propTypes = {
  day: PropTypes.string.isRequired,
  selected: PropTypes.PropTypes.bool.isRequired,
  onDatePress: PropTypes.func.isRequired,
  dayHeight: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: (1 / 7),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(135, 102, 238, 1)'
  },
  selectedContainer: {
    backgroundColor: 'transparent',
  },
  selectedWeek: {},
  selectedMonth: {
    backgroundColor: 'rgba(135, 102, 238, 0.95)'
  },
  day: {
    flex: 1,
    alignItems: 'center',    
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  date: {},
  selectedDate: {
    color: '#9977ff'
  },
});