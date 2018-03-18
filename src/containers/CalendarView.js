import React from 'react';
import { StyleSheet, Text, View, SectionList, Dimensions, findNodeHandle, PixelRatio, Platform, NativeModules, LayoutAnimation } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { format, differenceInCalendarWeeks, eachDay, startOfMonth, endOfMonth, isSameWeek, addWeeks, isSameMonth, addMonths, startOfWeek, endOfWeek, isBefore, isAfter} from 'date-fns';
import { Map, List, Seq } from 'immutable';
import { NavigationActions } from 'react-navigation';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'

import CalendarListWeek from '../components/CalendarListWeek';
import DocumentsView from './DocumentsView';

import { SELECT_DATE } from '../actionTypes';

class CalendarView extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    const { calendar } = props;
    const weeks = calendar.get('weeks');
    const selectedDate = calendar.get('selectedDate');
    const weekStartsOn = calendar.get('weekStartsOn');

    this.state = {
      scrollIndex: weeks.findIndex(item => isSameWeek(item, (selectedDate),{weekStartsOn: weekStartsOn})),
      dayHeight: PixelRatio.roundToNearestPixel(Dimensions.get('window').width / 7),
      spacerHeight: PixelRatio.roundToNearestPixel(Dimensions.get('window').width),
      onEndReachedCalledDuringMomentum: false,
      viewableItems: new Array,
      monthsWithRenderedWeeks: new List(),
      renderQueue: new List(),
      allViewableItemsRendered: false,
      unrenderedRenderQueueItems: new List(),
      isLoadingContent: true,
      scrollEnabled: true,
    };
  }
  
  _keyExtractor = (item, index) => item;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);
  
  _getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) => {
      const { dayHeight, spacerHeight} = this.state;
      if (sectionIndex === 1) {
        return spacerHeight;
      } else {
        return dayHeight;
      }
    },
    
    // These three properties are optional
    /*
    getSeparatorHeight: () => 1 / PixelRatio.get(), // The height of your separators
    getSectionHeaderHeight: () => 20, // The height of your section headers
    getSectionFooterHeight: () => 10, // The height of your section footers
    */
  })
  
  _renderItem = ({item}) => {
    const { calendar } = this.props;
    const { dayHeight, viewableItems, documentsInSelected, currentDocument, monthsWithRenderedWeeks, renderQueue, currentItemInRenderQueue, allViewableItemsRendered } = this.state;
    const selectedDate = calendar.get('selectedDate');
    const weekStartsOn = calendar.get('weekStartsOn');
    const isActiveWeek = isSameWeek(format(selectedDate, 'YYYY-MM-DD'), item, {weekStartsOn: weekStartsOn});
    //const unrenderedRenderQueueItems = renderQueue.filter((renderQueueItem) => monthsWithRenderedWeeks.filter((entry) => entry != renderQueueItem) );
    //const shouldRenderWeeks = (isActiveWeek || viewableItems.some((entry) => entry.item === item) || (monthsWithRenderedWeeks.some((entry) => entry === item)) || (allViewableItemsRendered && unrenderedRenderQueueItems.some((entry) => entry === item))); //with or without allViewableItemsRendered???

   return (
      <CalendarListWeek
        id={item}
        days={
          List((eachDay(startOfWeek(item, {weekStartsOn: weekStartsOn}),endOfWeek(item, {weekStartsOn: weekStartsOn}))).map((day) => (format(day, 'YYYY-MM-DD'))))
        }
        selectedDate={selectedDate}
        onDatePress={this._onDatePress}
        dayHeight={dayHeight}
        weekStartsOn={weekStartsOn}
        //shouldRenderWeeks={shouldRenderWeeks}
      />
    )
  }

  _renderSpacer = () => {
    const { dayHeight, spacerHeight} = this.state;
    console.log('spacerHeight', spacerHeight);
    return (
     <View style={[styles.spacer, {minHeight: spacerHeight}]}>
<Text>ejbgeajkgbejagbejb</Text>
      </View>
    )
  }

  _disableCalendarViewScroll = () => {
    console.log('disable');
    this.setState({ scrollEnabled: false });
  }

  _enableCalendarViewScroll = () => {
    console.log('enable');
    this.setState({ scrollEnabled: true });
  }  

  _onDatePress = (date) => {    
    const { calendar, selectDate } = this.props;
    //const weekStartsOn = calendar.get('weekStartsOn');

    //const weeks = calendar.get('weeks');
    //const selectedWeek = format(startOfWeek(date, {weekStartsOn: weekStartsOn}), 'YYYY-MM-DD');

    //const indexOfSelectedWeek = weeks.indexOf(selectedWeek);
    
    selectDate(date);
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
      console.log('onEndReachedCalledDuringMomentum');
    }
  }

  _onViewableItemsChanged = (event) => {
    console.log('_onViewableItemsChanged');
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

  _handleContentSizeChange = () => {
    const {isLoadingContent, scrollIndex} = this.state;

    if (isLoadingContent) {
      console.log('scrollToIndex', scrollIndex);
      this.setState({isLoadingContent: false});
      this.refList.scrollToLocation({sectionIndex: 0, itemIndex: scrollIndex, animated: false}); // remeber that header also pushes down
    }
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

  /*componentDidMount() {
    if (Platform.OS === 'android') {
      const { UIManager } = NativeModules;
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  */

  componentDidUpdate(prevProps, prevState) {
    const { calendar } = this.props;
    if (calendar.get('selectedDate') != prevProps.calendar.get('selectedDate')) {
      //const selectedWeek = format(startOfWeek(calendar.get('selectedDate'), {weekStartsOn: calendar.get('weekStartsOn')}), 'YYYY-MM-DD');
      //const itemIndex = calendar.get('weeks').indexOf(selectedWeek);

      //weeks.findIndex(item => isSameWeek(item, (selectedDate),{weekStartsOn: weekStartsOn}));
      this.refList && this.refList.scrollToLocation({sectionIndex: 0, itemIndex: calendar.get('weeks').findIndex(week => isSameWeek(week, calendar.get('selectedDate'),{weekStartsOn: calendar.get('weekStartsOn')}))})
      //this.refList && this.refList.scrollToLocation({sectionIndex: 0, itemIndex: itemIndex, animated: true}); 
    }
  }

  render() {
    const { calendar } = this.props;
    const { dayHeight, documentsInSelected, currentDocument, renderQueue, scrollIndex, scrollEnabled} = this.state;
    
    const selectedWeek = startOfWeek(calendar.get('selectedDate'), {weekStartsOn: calendar.get('weekStartsOn')});
    const formattedSelectedWeek = format(selectedWeek, 'YYYY-MM-DD');
  
    return (
      <View style={styles.container}>
        <SectionList
          ref={node => this.refList = node}
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          //ListFooterComponent={(<View style={{backgroundColor: '#8766ee' }}><Text>Bottom</Text></View>)}        
          //ListHeaderComponent={(<Text>Top</Text>)}
          sections={[
            {
              title: 'before',
              data: calendar.get('weeks').takeUntil(week => isAfter(week, formattedSelectedWeek)).toArray(),
              renderItem: this._renderItem,
              //extraData: this.state
            },
            {
              title: 'current',
              data: [{key: 'a'}],
              renderItem: this._renderSpacer
            },
            {
              title: 'after',
              data: calendar.get('weeks').skipUntil(week => isAfter(week, formattedSelectedWeek)).toArray(),
              renderItem: this._renderItem,
              //extraData: this.state
            },
          ]}


          /*

            {
              title: 'current',
              data: [{key: 'a'}, {key: 'b'}],
              renderItem: ({item}) => <View style={styles.testContainer}><Text>{item.key}</Text></View>
            },

          */
          //data={calendar.get('weeks')}
          //renderItem={this._renderItem}
          //extraData={this.state}
          getItem={this._getItem}
          getItemCount={this._getItemCount}
          getItemLayout={this._getItemLayout}
          keyExtractor={this._keyExtractor}
          initialScrollIndex={scrollIndex} // maybe subtract 1 due to https://github.com/facebook/react-native/issues/13202
          onEndReached={this._onEndReached}
          onMomentumScrollBegin={this._onMomentumScrollBegin}

          //onViewableItemsChanged={this._onViewableItemsChanged}
          onContentSizeChange={this._handleContentSizeChange}


          //windowSize={32}
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

/*

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
          initialScrollIndex={scrollIndex} // maybe subtract 1 due to https://github.com/facebook/react-native/issues/13202
          onEndReached={this._onEndReached}
          onMomentumScrollBegin={this._onMomentumScrollBegin}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          onViewableItemsChanged={this._onViewableItemsChanged}
          onContentSizeChange={this._handleContentSizeChange}
          //indowSize={32}
          //maxToRenderPerBatch={32}
          //renderQueue={renderQueue}
          //showsVerticalScrollIndicator={false}
          //initialNumToRender={6}
          //removeClippedSubviews={false}
          //onEndReachedThreshold={0.1}
        />
      </View>

      */

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

  },
  spacer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 255, 0, 0.25)',
  },
});