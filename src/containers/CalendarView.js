import React from 'react';
import { StyleSheet, Text, View, VirtualizedList, Dimensions, findNodeHandle } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { format, differenceInCalendarWeeks, eachDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getDaysInMonth, setDate, getISOWeek, isSameWeek, addWeeks, isThisYear, isThisMonth, isSameMonth, getDay } from 'date-fns';
import { Map, List, Seq } from 'immutable';
import { NavigationActions } from 'react-navigation';

import CalendarListMonth from '../components/CalendarListMonth';
import CalendarListMonthSeparator from '../components/CalendarListMonthSeparator';

import { SELECT_DATE } from '../actionTypes';

class CalendarView extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    const { calendar } = props;
    this.state = {
      scrollIndex: calendar.get('months').findIndex(item => item === format(calendar.get('selected'), 'YYYY-MM')),
      dayHeight: Math.round(Dimensions.get('window').width / 7)
    };
  }

  _keyExtractor = (item, index) => item;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);
  _getItemLayout = (data, index) => {
    const { calendar } = this.props;
    const { dayHeight } = this.state;
    const weeksInMonth = differenceInCalendarWeeks(endOfMonth(data.get(index)), startOfMonth(data.get(index))) + 2;
    const indexOfSelected = calendar.get('months').findIndex(item => item === format(new Date(), 'YYYY-MM'));
    const itemLength = 7 * dayHeight;

    return ({
      length: itemLength,
      offset: itemLength * index,
      index: index
    })
  }
  _renderItem = ({item}) => {
    const { calendar } = this.props;
    const { dayHeight } = this.state;    
    const { documentsInSelected, currentDocument } = this.state;
    const selected = calendar.get('selected');
    
    return (
      <CalendarListMonth
        id={item}
        weeks={List(new Array(differenceInCalendarWeeks(endOfMonth(item), startOfMonth(item)) + 1))
          .map((_,week) => (
            {days: Seq(eachDay(startOfMonth(item),endOfMonth(item))).filter((days) => (
              isSameWeek(days, addWeeks(item,week))))
              .map((day) => (format(day, 'YYYY-MM-DD')
              ))
            }
          ))
        }
        selected={isSameMonth(item, selected) && selected}
        onDatePress={this._onDatePress}
        dayHeight={dayHeight}
      />
    )
  }

  _onDatePress = (date, refCalendarListDay) => {     
    refCalendarListDay.measureLayout(
      findNodeHandle(this.refList),
      (x, y, width, height) => {console.log(x, y, width, height); this.refList.scrollToOffset({animated: true, offset: Math.round(y)})}
    );
    
    const { selectDate } = this.props;
    selectDate(date);
  }

  render() {
    const { calendar, addMonthsAfter } = this.props;    
    return (
      <View style={styles.container}>
        <VirtualizedList
          ref={node => this.refList = node}
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          ListFooterComponent={(<Text>Bottom</Text>)}        
          ListHeaderComponent={(<Text>Top</Text>)}
          data={calendar.get('months')}
          renderItem={this._renderItem}
          getItem={this._getItem}
          getItemCount={this._getItemCount}
          getItemLayout={this._getItemLayout}
          keyExtractor={this._keyExtractor}
          initialScrollIndex={this.state.scrollIndex - 1} // subtracting 1 due to https://github.com/facebook/react-native/issues/13202
          ItemSeparatorComponent={CalendarListMonthSeparator}
          onEndReached={addMonthsAfter}
          //showsVerticalScrollIndicator={false}
          windowSize={12}
          initialNumToRender={6}
          //removeClippedSubviews={true}
          //onEndReachedThreshold={0.1}
          onScroll={this._onListScroll}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  calendar: state.calendar,
  documents: state.documents,
});

const mapDispatchToProps = dispatch => ({
  selectDate: (date) => dispatch({ type: SELECT_DATE, date: date}),  
  addMonthsAfter: () => dispatch({ type: 'addMonthsAfter' }),  
});


export default connect(mapStateToProps, mapDispatchToProps)(CalendarView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  list: {
    flex: 1,
    alignSelf: 'stretch',
  },
  listContentContainer: {

  }
});