import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, Platform, ScrollView, Image, VirtualizedList} from 'react-native';
import { List } from 'immutable';
import { format, isThisYear, isEqual, isToday, isPast, isSameWeek, isAfter, getDay, isFirstDayOfMonth, isLastDayOfMonth} from 'date-fns';
import { Constants } from 'expo';

export default class CalendarListItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) { 
    const { selected } = this.props; 
    if (selected !== nextProps.selected) { 
      console.log("update because of selected", selected);
      return true;
    } else {
      return false;
    }
  };
  
  render() {
    const { id, weeks, selected, onPress } = this.props;
    const windowWidth = Dimensions.get('window').width;
    const dayWidth = Math.round(windowWidth / 7);
    return (
      <View style={[styles.container, selected && styles.selectedContainer, {minHeight: dayWidth * 7}]}>
        <View style={styles.margin} />
        <View style={[styles.header, {height: dayWidth}, selected && styles.selectedHeader]}>
            <View style={[styles.titleContainer, selected && styles.selectedTitleContainer]}>
              <Text>{isThisYear(id) ? format(id, 'MMMM') : format(id, 'MMM YYYY')}</Text>
            </View>
        </View>
        <View style={[styles.month]} >
          {weeks.map((week, index) => (
            [
              <View style={[styles.week, (index === 0 && styles.firstWeekInMonth), selected && isSameWeek(week.days.first(), selected) && styles.selectedWeek]} key={index}>
                {week.days.map((day, index) => {
                  const isSelectedDay = selected && isEqual(day, selected);
                  const isPastDay = isPast(day) && !isToday(day);
                  return (
                    [
                      selected && isFirstDayOfMonth(day) && (getDay(day) !== 0) &&
                        <View style={[styles.marginDay, {flex: (1 / 7) * getDay(day)}]}/>
                    ,
                      <TouchableNativeFeedback onPress={((e) => onPress(day))} background={TouchableNativeFeedback.SelectableBackground()} key={day}>
                        <View style={[styles.day, {height: dayWidth}, (isSelectedDay && styles.selectedDay), /* (selected && ((isSameWeek(day, selected) && isAfter(day, selected)) || isEqual(day, selected)) && {marginTop: daySize * 8}) */ ]}>
                          <Text style={[styles.date, isPastDay && styles.pastDate, (isSelectedDay && styles.selectedDate)]}>{format(day,'D')}</Text>
                        </View>
                      </TouchableNativeFeedback> 
                    ,
                      selected && isLastDayOfMonth(day) && (getDay(day) !== 7) &&
                        <View style={[styles.marginDay, {flex: (1 / 7) * (6 - getDay(day))}]} />
                    ]
                  )
                })}
              </View>
            ]
          ))}
        </View>
        <View style={styles.margin} />
      </View>
    );
  }
}

CalendarListItem.propTypes = {
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
  firstWeekInMonth: {
    justifyContent: 'flex-end'
  },
  image: {
    width: 200,
    height: 100
  },
  documentList: {height: 500},
  pageList: {height:300}
});