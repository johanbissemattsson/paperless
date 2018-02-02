import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableNativeFeedback, Platform} from 'react-native';
import { format, isEqual, isPast, isToday, isSameMonth, isSameWeek } from 'date-fns';

export default class CalenderListDay extends React.Component { 
  render() {
    const { day, selected, onDatePress, dayHeight, parentMonth, updateSelectedRef } = this.props;
    const isSelectedDay = selected && isEqual(day, selected);
    const isSameMonthAsParentMonth = isSameMonth(day, parentMonth);
    const isDisabled = !isSameMonthAsParentMonth && !isSameWeek(day, selected);
    
    return (
      <View style={[styles.container, isSelectedDay && styles.selectedContainer]} ref={node => {this.refCalendarListDay = node}}>
        <TouchableNativeFeedback onPress={((e) => onDatePress(day, this.refCalendarListDay, isSameMonthAsParentMonth))} background={TouchableNativeFeedback.SelectableBackground()} disabled={isDisabled}>
          <View style={[styles.day, {height: dayHeight}, isDisabled && {opacity: 0.01} /* (selected && ((isSameWeek(day, selected) && isAfter(day, selected)) || isEqual(day, selected)) && {marginTop: daySize * 8}) */ ]} >
            <Text style={[styles.date, (isSelectedDay && styles.selectedDate)]}>{format(day,'D')}</Text>
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
  dayHeight: PropTypes.number,
  parentMonth: PropTypes.string.isRequired,
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