import React from 'react';
import { StyleSheet, Text, View, VirtualizedList, Dimensions, findNodeHandle } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { format, differenceInCalendarWeeks, eachDay, startOfMonth, endOfMonth, isSameWeek, addWeeks, isSameMonth, addMonths} from 'date-fns';
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
      viewableItems: new Array,
      monthsWithRenderedWeeks: new List(),
      renderQueue: new List()
    };
  }

  _keyExtractor = (item, index) => item;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);
  _getItemLayout = (data, index) => {
    const { calendar } = this.props;
    const { dayHeight } = this.state;
    //const weeksInMonth = differenceInCalendarWeeks(endOfMonth(data.get(index)), startOfMonth(data.get(index))) + 2;
    const itemLength = 7 * dayHeight + 1; // adding 1 due to separator height (probably better if height of separator is calculated instead)
    return {
      length: itemLength,
      offset: itemLength * index,
      index: index
    }
  }
  _renderItem = ({item}) => {
    const { calendar } = this.props;
    const { dayHeight, viewableItems, documentsInSelected, currentDocument, monthsWithRenderedWeeks, renderQueue } = this.state;
    const selected = calendar.get('selected');
    const shouldRenderWeeks = (viewableItems.some((entry) => entry.item === item) || monthsWithRenderedWeeks.some((entry) => entry === item) || (renderQueue.first() === item));
    
    return (
      <CalendarListMonth
        id={item}
        weeks={
          List(new Array(differenceInCalendarWeeks(endOfMonth(item), startOfMonth(item)) + 1))
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
        shouldRenderWeeks={shouldRenderWeeks}
        addToMonthsWithRenderedWeeks={this.addToMonthsWithRenderedWeeks}
        removeFromMonthsWithRenderedWeeks={this.removeFromMonthsWithRenderedWeeks}
        onMonthRenderedWithWeeks={this.onMonthRenderedWithWeeks}
        //renderQueue={renderQueue}
        //updateRenderQueueAfterComponentDidUpdate={this.updateRenderQueueAfterComponentDidUpdate}
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
    const { renderQueue } = this.state;

    const viewableItems = event.viewableItems;
    const firstViewableMonth = viewableItems[0].item;
    const lastViewableMonth = viewableItems[viewableItems.length - 1].item;

    viewableItems.map((viewableItem) => {
      this.addToMonthsWithRenderedWeeks(viewableItem.item);
    })

    const newRenderQueue = List().withMutations((listWithMutations) => {
      for (let renderIndex = 0; renderIndex < 3; renderIndex++) {
        listWithMutations.push(format(addMonths(lastViewableMonth, renderIndex + 1), 'YYYY-MM'));
      }  
    });

    console.log('newRenderQueue', newRenderQueue);

    this.setState({viewableItems: viewableItems, renderQueue: newRenderQueue});
  }

  addToMonthsWithRenderedWeeks = (item) => {
    const { monthsWithRenderedWeeks } = this.state;
    if (!monthsWithRenderedWeeks.includes(item)) {
      console.log('add', item);      
      this.setState({monthsWithRenderedWeeks: monthsWithRenderedWeeks.push(item)})
    }
  }

  removeFromMonthsWithRenderedWeeks = (item) => {
    const { monthsWithRenderedWeeks } = this.state;
    console.log('remove', item);
    this.setState({monthsWithRenderedWeeks: monthsWithRenderedWeeks.filter(month => month != item)})
  }

  onMonthRenderedWithWeeks = (item) => {
    const { monthsWithRenderedWeeks, renderQueue } = this.state;
    const updatedRenderQueue = renderQueue.filter((entry) => entry != item);
    this.setState({renderQueue: updatedRenderQueue});
    console.log('updatedRenderQueue', updatedRenderQueue);
    this.addToMonthsWithRenderedWeeks(item);
    /*
    if (renderQueue && !renderQueue.isEmpty() && item === renderQueue.first()) {
      const updatedRenderQueue = renderQueue.shift();
      this.setState('renderQueue', updatedRenderQueue);
      console.log('Updated renderQueue', renderQueue);
    } else if (monthsWithRenderedWeeks.some((entry) => entry === item)) {
      const newRenderQueue = List().withMutations((listWithMutations) => {
        for (let renderIndex = 0; renderIndex < 3; renderIndex++) {
          listWithMutations.push(format(addMonths(item, renderIndex + 1), 'YYYY-MM'));
        }  
      });
      this.setState('renderQueue', newRenderQueue);
      console.log('New renderQueue:', renderQueue);
    }
    */
  }

  render() {
    const { calendar } = this.props;
    const { dayHeight, documentsInSelected, currentDocument } = this.state;    
    //const { renderQueue } = this.state;
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
          //windowSize={18}
          //initialNumToRender={12}
          //maxToRenderPerBatch={32}
          //renderQueue={renderQueue}
          //showsVerticalScrollIndicator={false}
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