import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { Map, List, Seq } from 'immutable';
import { format, differenceInWeeks, eachDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getDaysInMonth, setDate, getISOWeek, isSameWeek, addWeeks } from 'date-fns';
/* Following is needed for weekOfMonth */
//import moment from 'moment';
//import 'moment-recur';

export default class ListItem extends React.PureComponent {
  render() {
    const { name, days, isThisMonth, daySize, windowSze } = this.props;
    
    return (
      <View style={[styles.container, {width: windowSze}]}>
        <View style={styles.header}>
          <Text>{name}</Text>
        </View>
        <View style={styles.days}>
          {days.map((day, index) => (
            <View style={[styles.day, {width: daySize , height: daySize}]} key={index}>
              <Text style={styles.date}>{format(day, 'D')}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

ListItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  days: PropTypes.array.isRequired,
  isThisMonth: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  day: {
    backgroundColor: '#ee7700'
  }
});


/*
const initMonth = (date) => {
  const daysOfMonth = eachDay(startOfMonth(date),endOfMonth(date));
  return [
    {
      key: format(date, 'YYYYMM'),
      name: format(date, 'MMMM'),
      weeks: new Array(differenceInWeeks(endOfMonth(date), startOfMonth(date)) + 1)
      .fill()
      .map((_,w) => ({
        startOfWeek: w
      }))
    },
  ]
}
    format(subMonths(date, 1), formatConfig),
*/
