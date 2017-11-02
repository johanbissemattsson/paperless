import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { List, Map } from 'immutable';
import { format, isThisYear } from 'date-fns';
import { Constants } from 'expo';

import CalendarListWeek from './CalendarListWeek';
import CalendarListDay from './CalendarListDay';

export default class CalendarListMonth extends React.Component {
  shouldComponentUpdate(nextProps, nextState) { 
    const { selected } = this.props; 
    if (selected !== nextProps.selected) { 
      console.log("update because of selected", nextProps.selected);
      return true;
    } else {
      return false;
    }
  };
  
  render() {
    const { id, weeks, selected, onDatePress, dayHeight } = this.props;
    
    return (
      <View style={[styles.container, selected && styles.selectedContainer, {minHeight: dayHeight * 7}]}>
        <View style={styles.margin} />
        <View style={[styles.header, {height: dayHeight}, selected && styles.selectedHeader]}>
          <View style={[styles.titleContainer, selected && styles.selectedTitleContainer]}>
            <Text>{isThisYear(id) ? format(id, 'MMMM') : format(id, 'MMM YYYY')}</Text>
          </View>
        </View>
        <View style={[styles.month]} >
          {weeks.map((week, weekIndex) => (
            <CalendarListWeek week={week} selected={selected} key={weekIndex}>
              {week.days.map((day, dayIndex) => (
                <CalendarListDay day={day} selected={selected} dayHeight={dayHeight} onDatePress={onDatePress} key={dayIndex}/>
              ))}
            </CalendarListWeek>
          ))}
        </View>
        <View style={styles.margin} />
      </View>
    );
  }
}

CalendarListMonth.propTypes = {
  id: PropTypes.string.isRequired,
  weeks: PropTypes.instanceOf(List).isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onDatePress: PropTypes.func.isRequired,
  dayHeight: PropTypes.number  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',    
    alignSelf: 'stretch',
    backgroundColor: '#8766ee'   
  },
  selectedContainer: {
    backgroundColor: 'transparent',
  },
  margin: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#8766ee'    
  },
  marginDay: {
    backgroundColor: '#8766ee'    
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#8766ee'    
  },
  titleContainer: {
    backgroundColor: '#9977ff',
    borderRadius: 100,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 1,
  },
  selectedTitleContainer: {
  },
  selectedHeader: {
  },
  month: {
    alignItems: 'stretch',
    justifyContent: 'center',
    alignSelf: 'stretch',  
  }
});