import React from 'react';
import { StyleSheet, Text, View, SectionList, VirtualizedList, Dimensions, findNodeHandle, PixelRatio, Platform, NativeModules, LayoutAnimation } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { format, differenceInCalendarWeeks, eachDay, startOfMonth, endOfMonth, isSameWeek, addWeeks, isSameMonth, addMonths, startOfWeek, endOfWeek, isBefore, isAfter} from 'date-fns';
import { Map, List, Seq } from 'immutable';
import { NavigationActions } from 'react-navigation';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'

import CalendarListWeek from '../components/CalendarListWeek';
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
    const { calendar } = this.props;
    const oldSelectedWeekIndex = calendar.get('weeks').findIndex((weekItem) => weekItem.get('isSelectedWeek'));
    const pressedSelectedWeekIndex = calendar.get('weeks').findIndex((weekItem) => isSameWeek(date, weekItem.get('days').first().get('date'), {weekStartsOn: calendar.get('weekStartsOn')}));
    const weekDiff = pressedSelectedWeekIndex - oldSelectedWeekIndex;

    this.props.selectDate(date);
    this.refSectionList.scrollToLocation({sectionIndex: 1, itemIndex: 0, animated: true, viewOffset: this.state.dayHeight - this.state.dayHeight * weekDiff});
  }

  _keyExtractor = (item, index) => index;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);
  
  _getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) => {
      if (sectionIndex === 1) {
        return this.state.spacerHeight;
      } else {
        return this.state.dayHeight;
      }
    },
  })
  
  _renderItem = ({item, index}) => {
    return (
      <CalendarListWeek week={item} height={this.state.dayHeight} onDatePress={this._onDatePress}/>
    );
  }

  _onEndReached = () => {
    console.log('_onCalendarEndReached');
    //this.props.addWeeksAfter();
  }

  _onViewableItemsChanged = (viewableItems, changed) => {
    //console.log('onViewableItemsChanged');
    //console.log('onViewableItemsChanged', viewableItems);
  }

  _renderDocuments = () => {
    const { dayHeight, spacerHeight} = this.state;
    
    return (
      <View style={[styles.spacer, {minHeight: spacerHeight}]}>
        <Text>ejbgeajkgbejagbejb</Text>
      </View>
    )
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
              data: calendar.get('weeks').filter((week) => (week.get('isBeforeSelectedWeek') || week.get('isSelectedWeek'))).toArray(),
              renderItem: this._renderItem,
            },
            {
              data: [{key: 'a'}],
              renderItem: this._renderDocuments
            },
            {
              data: calendar.get('weeks').filter((week) => (week.get('isAfterSelectedWeek'))).toArray(),
              renderItem: this._renderItem,
            },
          ]}
            getItem={this._getItem}
            //extraData={this.state}
            getItemCount={this._getItemCount}
            getItemLayout={this._getItemLayout}
            keyExtractor={this._keyExtractor}
            onEndReached={this._onEndReached}
            onViewableItemsChanged={this._onViewableItemsChanged}
            //onScroll={this._onScroll}
            //nestedScrollEnabled={true} // https://github.com/facebook/react-native/pull/18299 Hopefully next React Native version will resolve this...
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