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

  _handleContentSizeChange = () => {
    const {isLoadingContent, scrollIndex} = this.state;

    if (isLoadingContent) {
      console.log('scrollToIndex', scrollIndex);
      this.setState({isLoadingContent: false});
      this.refList.scrollToLocation({sectionIndex: 0, itemIndex: scrollIndex, animated: false}); // remeber that header also pushes down
    }
  }

  /*componentDidMount() {
    if (Platform.OS === 'android') {
      const { UIManager } = NativeModules;
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  */  
  
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
  })
  
  _renderItem = ({item}) => {
    const { calendar } = this.props;
    const { dayHeight, viewableItems, documentsInSelected, currentDocument, monthsWithRenderedWeeks, renderQueue, currentItemInRenderQueue, allViewableItemsRendered } = this.state;
    const selectedDate = calendar.get('selectedDate');
    const weekStartsOn = calendar.get('weekStartsOn');
    const isActiveWeek = isSameWeek(format(selectedDate, 'YYYY-MM-DD'), item, {weekStartsOn: weekStartsOn});

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

  componentDidUpdate(prevProps, prevState) {
    const { calendar } = this.props;
    if (calendar.get('selectedDate') != prevProps.calendar.get('selectedDate')) {
      this.refList && this.refList.scrollToLocation({sectionIndex: 0, itemIndex: calendar.get('weeks').findIndex(week => isSameWeek(week, calendar.get('selectedDate'),{weekStartsOn: calendar.get('weekStartsOn')}))})
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
          sections={[
            {
              title: 'before',
              data: calendar.get('weeks').takeUntil(week => isAfter(week, formattedSelectedWeek)).toArray(),
              renderItem: this._renderItem,
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
            },
          ]}
          getItem={this._getItem}
          getItemCount={this._getItemCount}
          getItemLayout={this._getItemLayout}
          keyExtractor={this._keyExtractor}
          initialScrollIndex={scrollIndex} // maybe subtract 1 due to https://github.com/facebook/react-native/issues/13202
          onEndReached={this._onEndReached}
          onMomentumScrollBegin={this._onMomentumScrollBegin}
          onContentSizeChange={this._handleContentSizeChange}
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

  },
  spacer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 255, 0, 0.25)',
  },
});