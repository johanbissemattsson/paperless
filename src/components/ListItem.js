import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, Platform} from 'react-native';
import { List } from 'immutable';
import { format, isThisYear, isEqual, isToday, isPast, isSameWeek} from 'date-fns';
import { LinearGradient } from 'expo';

export default class ListItem extends React.PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    const { selected } = this.props;
    if (selected !== nextProps.selected) {
      return true;
    }
    return false;
  }

  render() {
    const { id, weeks, selected, onPress } = this.props;
    const windowWidth = Dimensions.get('window').width;
    const dayHeight = windowWidth / 7;

    return (
      <View style={[styles.container, selected && styles.selectedContainer, {height: dayHeight * 7}]}>
        {!selected && <LinearGradient style={[styles.gradient, {height: dayHeight / 2}]} colors={['rgba(0,0,0,0.125)', 'rgba(0,0,0,0)']}/>}
        <View style={[styles.header, {height: dayHeight}]}>
            <View style={[styles.titleContainer, selected && styles.selectedTitleContainer]}>
              <Text>{isThisYear(id) ? format(id, 'MMMM') : format(id, 'MMM YYYY')}</Text>
            </View>
        </View>
        <View style={[styles.month]} >
          {weeks.map((week, index) => (
            [
              <View style={[styles.week, (index === 0 && styles.firstWeekInMonth), selected && isSameWeek(week.days.first(), selected) && styles.selectedWeek]} key={index}>
                {week.days.map((day, index) => (
                  <TouchableNativeFeedback onPress={((e) => onPress(day))} background={TouchableNativeFeedback.SelectableBackground()} key={day}>
                    <View style={[styles.day, {height: dayHeight}, selected && isEqual(day, selected) && styles.selectedDay]}>
                      <Text style={[styles.date, isPast(day) && !isToday(day) && styles.pastDate]}>{format(day,'D')}</Text>
                    </View>
                  </TouchableNativeFeedback>                    
                ))}
              </View>
            ]
          ))}
        </View>
      </View>
    );
  }
}

ListItem.propTypes = {
  id: PropTypes.string.isRequired,
  weeks: PropTypes.instanceOf(List).isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onPress: PropTypes.func.isRequired  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',    
    alignSelf: 'stretch',
  },
  selectedContainer: {
    backgroundColor: '#aa99ff'
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },

  titleContainer: {
    backgroundColor: '#8766ee',
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
  gradient: {
    width: '100%',
    position: 'absolute',
    top: 0
  },
  sameWeek: {

  },
  month: {
    alignItems: 'stretch',
    justifyContent: 'center',
    alignSelf: 'stretch',  
  },
  week: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  selectedWeek: {

  },
  day: {
    flex: (1 / 7),
    alignItems: 'center',    
    justifyContent: 'center',   
  },
  selectedDay: {
    backgroundColor: '#fff'
  },
  date: {},
  pastDate: {
    color: 'rgba(0,0,0,0.25)'
  },
  firstWeekInMonth: {
    justifyContent: 'flex-end'
  },
});