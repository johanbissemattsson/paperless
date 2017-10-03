import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { Map, List, Seq } from 'immutable';
import { format, isThisYear, differenceInWeeks, eachDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getDaysInMonth, setDate, getISOWeek, isSameWeek, addWeeks } from 'date-fns';

export default class ListItem extends React.PureComponent {
  render() {
    const { id, weeks, isThisMonth } = this.props;
    const dayHeight = Dimensions.get('window').width / 7; 
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>{isThisYear(id) ? format(id, 'MMMM') : format(id, 'MMM YYYY')}</Text>
        </View>
        <View style={styles.month}>
          {weeks.map((week, index) => (
            <View style={[styles.week, (index === 0 && styles.firstWeekInMonth)]} key={index}>
              {week.days.map((day, index) => (
                <View style={[styles.day, {height: dayHeight}]} key={day}>
                  <Text style={styles.date}>{format(day,'D')}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }
}

ListItem.propTypes = {
  id: PropTypes.string.isRequired,
  weeks: PropTypes.instanceOf(List).isRequired,
  isThisMonth: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',    
    justifyContent: 'center',    
    alignSelf: 'stretch',
    height: 400,
  },
  header: {
    backgroundColor: '#8766eed',
    borderRadius: 100,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 3,
    marginTop: 10
  },
  month: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    alignSelf: 'stretch',  
  },
  week: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    
  },
  day: {
    flex: (1 / 7),
    alignItems: 'center',    
    justifyContent: 'center',

    
  },
  firstWeekInMonth: {
    justifyContent: 'flex-end'
  },
});