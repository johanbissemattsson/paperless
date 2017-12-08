import React from 'react';
import { StyleSheet, Text, View, VirtualizedList, Dimensions, findNodeHandle } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { format, differenceInCalendarWeeks, eachDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getDaysInMonth, setDate, getISOWeek, isSameWeek, addWeeks, isThisYear, isThisMonth, isSameMonth, getDay, isSameMinute } from 'date-fns';
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
      dayHeight: Math.round(Dimensions.get('window').width / 7),
      onEndReachedCalledDuringMomentum: false,
    };
  }

  _keyExtractor = (item, index) => item;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);
  _getItemLayout = (data, index) => {
    const { calendar } = this.props;
    const { dayHeight } = this.state;
    const weeksInMonth = differenceInCalendarWeeks(endOfMonth(data.get(index)), startOfMonth(data.get(index))) + 2;
    const itemLength = 7 * dayHeight + 1; // adding 1 due to separator height (probably better if height of separator is calculated instead)
    return {
      length: itemLength,
      offset: itemLength * index,
      index: index
    }
  }
  _renderItem = ({item}) => {
    const { calendar } = this.props;
    const { dayHeight } = this.state;
    const { viewableItems, documentsInSelected, currentDocument } = this.state;
    const selected = calendar.get('selected');
    const isVisible = viewableItems ? viewableItems.some((object) => object.item === item) : true; // treat all items as visible initially (isVisible is mainly for new items)

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
        isVisible={isVisible}
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

  _onMomentumScrollBegin = () => {
    this.setState({onEndReachedCalledDuringMomentum: false}); // prevent onEndReached to be triggered twice
  }

  _onEndReached = () => {
    const { addMonthsAfter } = this.props;
    const { onEndReachedCalledDuringMomentum } = this.state;
    if (!onEndReachedCalledDuringMomentum) {
      this.setState({onEndReachedCalledDuringMomentum: true});
      addMonthsAfter();      
    }
  }

  _onViewableItemsChanged = (event) => {
    this.setState({viewableItems: event.viewableItems});
  }

  render() {
    const { calendar } = this.props;

    return (
      <View style={styles.container}>
        <VirtualizedList
          ref={node => this.refList = node}
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          ListFooterComponent={(<View style={{backgroundColor: '#8766ee' }}><Text>Bottom</Text></View>)}        
          ListHeaderComponent={(<Text>Top</Text>)}
          data={calendar.get('months')}
          renderItem={this._renderItem}
          extraData={this.state}
          getItem={this._getItem}
          getItemCount={this._getItemCount}
          getItemLayout={this._getItemLayout}
          keyExtractor={this._keyExtractor}
          initialScrollIndex={this.state.scrollIndex - 1} // subtracting 1 due to https://github.com/facebook/react-native/issues/13202
          ItemSeparatorComponent={CalendarListMonthSeparator}
          onEndReached={this._onEndReached}
          onMomentumScrollBegin={this._onMomentumScrollBegin}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          onViewableItemsChanged={this._onViewableItemsChanged}
          //showsVerticalScrollIndicator={false}
          //windowSize={12}
          //initialNumToRender={6}
          //removeClippedSubviews={false}
          //onEndReachedThreshold={0.1}
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