import React from 'react';
import { findNodeHandle } from 'react-native';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableNativeFeedback, Platform} from 'react-native';
import { format, isEqual, isPast, isToday } from 'date-fns';

export default class CalenderListDay extends React.Component { 
  render() {
    const { day, selected, onDatePress, dayHeight } = this.props;
    const isSelectedDay = selected && isEqual(day, selected);
    const isPastDay = isPast(day) && !isToday(day);

    return (
      <View style={styles.container} ref={node => {this.refCalendarListDay = node}}>
        <TouchableNativeFeedback onPress={((e) => onDatePress(day, this.refCalendarListDay))} background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={[styles.day, {height: dayHeight}, (isSelectedDay && styles.selectedDay), /* (selected && ((isSameWeek(day, selected) && isAfter(day, selected)) || isEqual(day, selected)) && {marginTop: daySize * 8}) */ ]}>
            <Text style={[styles.date, isPastDay && styles.pastDate, (isSelectedDay && styles.selectedDate)]}>{format(day,'D')}</Text>
          </View>
        </TouchableNativeFeedback> 
      </View>
    );
  }
}

CalenderListDay.propTypes = {
  day: PropTypes.string.isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onDatePress: PropTypes.func.isRequired,
  dayHeight: PropTypes.number
};

const styles = StyleSheet.create({
  container: {
    flex: (1 / 7),
    alignItems: 'center',
    justifyContent: 'center',    
  },
  day: {
    flex: 1,
    alignItems: 'center',    
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(135, 102, 238, 1)'    
  },
  selectedDay: {
    backgroundColor: 'transparent',
  },
  date: {},
  selectedDate: {
    color: '#9977ff'
  },
  pastDate: {
    color: 'rgba(0,0,0,0.25)'
  },
});