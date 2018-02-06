import React from 'react';
import { StyleSheet, Text, View, VirtualizedList, Dimensions, findNodeHandle, PixelRatio} from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { format, differenceInCalendarWeeks, eachDay, startOfMonth, endOfMonth, isSameWeek, addWeeks, isSameMonth, addMonths, startOfWeek, endOfWeek, isEqual} from 'date-fns';
import { Map, List, Seq } from 'immutable';
import { NavigationActions } from 'react-navigation';

import CalendarListWeek from '../components/CalendarListWeek';
import CalendarListMonthSeparator from '../components/CalendarListMonthSeparator';

import { SELECT_DATE } from '../actionTypes';

class CalendarView extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    const { calendar } = props;

    this.state = {
      scrollIndex: calendar.get('weeks').findIndex(item => item === format(calendar.get('selected'), 'YYYY-MM-DD')),
      dayHeight: PixelRatio.roundToNearestPixel(Dimensions.get('window').width / 7),
      onEndReachedCalledDuringMomentum: false,
      viewableItems: new Array,
      monthsWithRenderedWeeks: new List(),
      renderQueue: new List(),
      allViewableItemsRendered: false,
      unrenderedRenderQueueItems: new List()
    };
  }

  _keyExtractor = (item, index) => item;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);
  _getItemLayout = (data, index) => {
    const { calendar } = this.props;
    const { dayHeight } = this.state;
    //const weeksInMonth = differenceInCalendarWeeks(endOfMonth(data.get(index)), startOfMonth(data.get(index))) + 2;
    const itemLength = dayHeight; // add 1 for borders due to separator height (though probably better if height of separator is calculated instead)
    return {
      length: itemLength,
      offset: itemLength * index,
      index: index
    }
  }
  _renderItem = ({item}) => {
    const { calendar } = this.props;
    const { dayHeight, viewableItems, documentsInSelected, currentDocument, monthsWithRenderedWeeks, renderQueue, currentItemInRenderQueue, allViewableItemsRendered } = this.state;
    const selected = calendar.get('selected');
    const weekStartsOn = calendar.get('weekStartsOn');
    const isActiveWeek = isEqual(format(selected, 'YYYY-MM-DD'), item);
    //const unrenderedRenderQueueItems = renderQueue.filter((renderQueueItem) => monthsWithRenderedWeeks.filter((entry) => entry != renderQueueItem) );
    //const shouldRenderWeeks = (isActiveWeek || viewableItems.some((entry) => entry.item === item) || (monthsWithRenderedWeeks.some((entry) => entry === item)) || (allViewableItemsRendered && unrenderedRenderQueueItems.some((entry) => entry === item))); //with or without allViewableItemsRendered???

   return (
      <CalendarListWeek
        id={item}
        days={
          List((eachDay(startOfWeek(item, {weekStartsOn: weekStartsOn}),endOfWeek(item, {weekStartsOn: weekStartsOn}))).map((day) => (format(day, 'YYYY-MM-DD'))))
        }
        selected={selected}
        onDatePress={this._onDatePress}
        dayHeight={dayHeight}
        weekStartsOn={weekStartsOn}
        //shouldRenderWeeks={shouldRenderWeeks}
      />
    )
  }

  _onDatePress = (date, refCalendarListDay) => {    
    const { selectDate } = this.props;
    selectDate(date);
  }

  componentDidUpdate() {
    /*
    const {activeCalendarListWeek} = this.state;
    if (activeCalendarListWeek) {
      this.setState({activeCalendarListWeek: null});
      activeCalendarListWeek.measureLayout(
        findNodeHandle(this.refList),
        (x, y, width, height) => {
          //const offset = Math.round(y) - Constants.statusBarHeight;
          const offset = PixelRatio.roundToNearestPixel(y);
          this.refList.scrollToOffset({animated: true, offset: offset});
          //this.refList.scrollToOffset({animated: true, offset: offset});
        }
      );
    */
  }

  _updateActiveCalendarListWeek = (refCalendarListWeek) => {
    if (refCalendarListWeek) {
      this.setState({activeCalendarListWeek: refCalendarListWeek});
    }
    
  }

  _onMomentumScrollBegin = () => {
    this.setState({onEndReachedCalledDuringMomentum: false}); // prevent onEndReached to be triggered twice
  }

  _onEndReached = () => {
    const { addWeeksAfter } = this.props;
    const { onEndReachedCalledDuringMomentum } = this.state;
    if (!onEndReachedCalledDuringMomentum) {
      this.setState({onEndReachedCalledDuringMomentum: true});
      addWeeksAfter();      
    }
  }

  _onViewableItemsChanged = (event) => {
    const { renderQueue, monthsWithRenderedWeeks } = this.state;
    /*
    const viewableItems = event.viewableItems;
    const firstViewableMonth = viewableItems[0].item;
    const lastViewableMonth = viewableItems[viewableItems.length - 1].item;

    const newRenderQueue = List().withMutations((listWithMutations) => {
      for (let renderIndex = 0; renderIndex < 3; renderIndex++) {
        listWithMutations.push(format(addMonths(lastViewableMonth, renderIndex + 1), 'YYYY-MM'));
      }  
    });
    if (viewableItems.map((viewableItem) => monthsWithRenderedWeeks.includes(viewableItem))) {     
      this.setState({viewableItems: viewableItems, renderQueue: newRenderQueue, allViewableItemsRendered: true});
      //console.log('all viewable rendered');
    } else {
      //console.log('all viewable not rendered');
      this.setState({viewableItems: viewableItems, renderQueue: newRenderQueue, allViewableItemsRendered: false});
    }
    */

  }

  addToMonthsWithRenderedWeeks = (item) => {
    /*
    const { monthsWithRenderedWeeks } = this.state;
    if (!monthsWithRenderedWeeks.includes(item)) {
      //console.log('add', item);      
      this.setState({monthsWithRenderedWeeks: monthsWithRenderedWeeks.push(item)})
    }
    */
  }

  removeFromMonthsWithRenderedWeeks = (item) => {
    /*
    const { monthsWithRenderedWeeks } = this.state;
    //console.log('remove', item);
    this.setState({monthsWithRenderedWeeks: monthsWithRenderedWeeks.filter(month => month != item)})
    */
  }

  onMonthRenderedWithWeeks = (item) => {
    /*
    const { monthsWithRenderedWeeks, renderQueue, currentItemInRenderQueue, viewableItems } = this.state;
    const updatedRenderQueue = renderQueue.filter((entry) => (entry != item));

    this.setState({renderQueue: updatedRenderQueue, currentItemInRenderQueue: updatedRenderQueue.first()});
    //console.log('updated renderqueue', updatedRenderQueue, 'currentItemInRenderQueue', currentItemInRenderQueue, 'unrenderedRenderQueueItems', unrenderedRenderQueueItems);
    this.addToMonthsWithRenderedWeeks(item);
    */
  }

  render() {
    const { calendar } = this.props;
    const { dayHeight, documentsInSelected, currentDocument, renderQueue } = this.state;    
    //const { renderQueue } = this.state;
    return (
      <View style={styles.container}>
        <VirtualizedList
          ref={node => this.refList = node}
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          ListFooterComponent={(<View style={{backgroundColor: '#8766ee' }}><Text>Bottom</Text></View>)}        
          ListHeaderComponent={(<Text>Top</Text>)}
          data={calendar.get('weeks')}
          renderItem={this._renderItem}
          extraData={this.state}
          getItem={this._getItem}
          getItemCount={this._getItemCount}
          getItemLayout={this._getItemLayout}
          keyExtractor={this._keyExtractor}
          //initialScrollIndex={this.state.scrollIndex - 1} // subtracting 1 due to https://github.com/facebook/react-native/issues/13202
          //ItemSeparatorComponent={CalendarListMonthSeparator}
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
  addWeeksAfter: () => dispatch({ type: 'addWeeksAfter' }),  
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