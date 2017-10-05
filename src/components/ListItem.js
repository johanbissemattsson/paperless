import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { List } from 'immutable';
import { format, isThisYear, isEqual, isToday, isPast, isSameWeek} from 'date-fns';
import { LinearGradient } from 'expo';

export default class ListItem extends React.PureComponent {
  render() {
    const { id, weeks, selected } = this.props;
    const dayHeight = Dimensions.get('window').width / 7;

    return (
      <View style={[styles.container, selected && styles.selectedContainer, {height: Dimensions.get('window').height}]}>
        <LinearGradient style={styles.gradient} colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0)']}/>
        <View style={[styles.header, selected && styles.selectedHeader]}>
          <Text>{isThisYear(id) ? format(id, 'MMMM') : format(id, 'MMM YYYY')}</Text>
        </View>
        <View style={styles.month} >
          {weeks.map((week, index) => (
            <View style={[styles.week, (index === 0 && styles.firstWeekInMonth), selected && isSameWeek(week.days.first(), selected) && styles.selectedWeek]} key={index}>
              {week.days.map((day, index) => (
                <View style={[styles.day, {height: dayHeight}, selected && isEqual(day, selected) && styles.selectedDay]} key={day}>
                  <Text style={[styles.date, isPast(day) && !isToday(day) && styles.pastDate]}>{format(day,'D')}</Text>
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
  selected: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',    
    justifyContent: 'center',    
    alignSelf: 'stretch',
  },
  selectedContainer: {
    backgroundColor: '#aa33ee'    
  },
  header: {
    backgroundColor: '#8766ee',
    borderRadius: 100,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 1,
    marginTop: 16
  },
  selectedHeader: {
    backgroundColor: '#5733cc'
  },
  gradient: {
    width: '100%',
    height: 48,
    position: 'absolute',
    top: 0
  },
  sameWeek: {
    borderColor: 'red',
    borderWidth: 2
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
  selectedWeek: {
    borderColor: 'red',
    borderWidth: 2
  },
  day: {
    flex: (1 / 7),
    alignItems: 'center',    
    justifyContent: 'center',   
  },
  selectedDay: {
    backgroundColor: '#5733cc'
  },
  date: {},
  pastDate: {
    color: 'rgba(0,0,0,0.25)'
  },
  firstWeekInMonth: {
    justifyContent: 'flex-end'
  },
});