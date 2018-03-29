import React from 'react';
import { StyleSheet, Text, View, SectionList, VirtualizedList, Dimensions, findNodeHandle, PixelRatio, Platform, NativeModules, LayoutAnimation } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { format, differenceInCalendarWeeks, eachDay, startOfMonth, endOfMonth, isSameWeek, addWeeks, isSameMonth, addMonths, startOfWeek, endOfWeek, isBefore, isAfter} from 'date-fns';
import { Map, List, Seq } from 'immutable';
import { NavigationActions } from 'react-navigation';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'

import CalendarList from '../components/CalendarList';
import DocumentsView from './DocumentsView';

import { SELECT_DATE } from '../actionTypes';

class CalendarView extends React.Component {
  constructor(props, context) {
    super(props, context);

    const { calendar } = props;
    const weeks = calendar.get('weeks');
    const selectedDate = calendar.get('selectedDate');
    const weekStartsOn = calendar.get('weekStartsOn');
    
    this.state = {
      dayHeight: PixelRatio.roundToNearestPixel(Dimensions.get('window').width / 7),
      spacerHeight: PixelRatio.roundToNearestPixel(Dimensions.get('window').width),
      sectionListChildrenRendered: 0,
      isLoadingContent: true 
    };
  }

  _onDatePress = (date) => {    
    this.props.selectDate(date);
    this.refSectionList.scrollToLocation({sectionIndex: 1, itemIndex: 0, animated: true, viewOffset: this.state.dayHeight});
  }

  _onCalendarEndReached = (isBefore) => {
    if (!isBefore) {
      console.log('_onCalendarEndReached before:', isBefore);
      this.props.addWeeksAfter();
    }
  }
    
  _keyExtractor = (item, index) => item;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);
  
  _getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) => {
      if (sectionIndex === 1) {
        return this.state.spacerHeight;
      } else {
        return rowData.weeks.size * this.state.dayHeight;
      }
    },
  })
  
  _renderListBefore = ({item, index}) => {
    const {dayHeight} = this.state;
    return (
      <CalendarList before weeks={item.weeks} dayHeight={dayHeight} onDatePress={this._onDatePress} onCalendarEndReached={this._onCalendarEndReached} />
    );
  }  

  _renderListAfter = ({item, index}) => {
    const {dayHeight} = this.state;
    
    return (
      <CalendarList after weeks={item.weeks} dayHeight={dayHeight} onDatePress={this._onDatePress} onCalendarEndReached={this._onCalendarEndReached} />
    );
  }

  _renderDocuments = () => {
    const { dayHeight, spacerHeight} = this.state;
    
    return (
      <View style={[styles.spacer, {minHeight: spacerHeight}]}>
        <Text>ejbgeajkgbejagbejb</Text>
      </View>
    )
  }


  _onScroll = ({nativeEvent}) => {
    if (nativeEvent.contentOffset.y === 0) {
      console.log('0!!');
    }
  }

  _handleContentSizeChange = () => {
    console.log('_handleContentSizeChange');
    if (this.state.isLoadingContent) {
      console.log('aj');
      this.setState({isLoadingContent: false});
      this.refSectionList.scrollToLocation({sectionIndex: 1, itemIndex: 0, animated: true, viewOffset: this.state.dayHeight});
    }
  }

  /*
  * Render SectionList
  */
  render() {
    const { calendar } = this.props;
    const { dayHeight } = this.state;

    return (
      <View style={styles.container}>
        <SectionList
          ref={node => this.refSectionList = node}
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          sections={[
            {
              data: [{weeks: calendar.get('weeks').filter((week) => (week.get('isBeforeSelectedWeek') || week.get('isSelectedWeek')))}], // Pass data to nested Flat lists - modified from https://github.com/facebook/react-native/issues/13192#issuecomment-306311168
              renderItem: this._renderListBefore,
            },
            {
              data: [{key: 'a'}],
              renderItem: this._renderDocuments
            },
            {
              data: [{weeks: calendar.get('weeks').filter((week) => (week.get('isAfterSelectedWeek')))}], // Pass data to nested Flat lists - modified from https://github.com/facebook/react-native/issues/13192#issuecomment-306311168
              renderItem: this._renderListAfter,
            },
          ]}
          getItem={this._getItem}
          extraData={this.state}
          getItemCount={this._getItemCount}
          getItemLayout={this._getItemLayout}
          keyExtractor={this._keyExtractor}
          onScroll={this._onScroll}
          scrollEventThrottle={0}
          nestedScrollEnabled={true} // https://github.com/facebook/react-native/pull/18299 Hopefully next React Native version will resolve this...
          //debug={true} 
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
    alignSelf: 'stretch'
  },
  list: {
  },
  listContentContainer: {
    //flexGrow: 1
  },
  spacer: {

  },
});