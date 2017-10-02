import React from 'react';
import { StyleSheet, Text, View, Button, VirtualizedList, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { format, differenceInCalendarWeeks, eachDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getDaysInMonth, setDate, getISOWeek, isSameWeek, addWeeks, isThisYear, isThisMonth, getDay } from 'date-fns';
import { Map, List, Seq } from 'immutable';

import DocumentButton from '../components/DocumentButton';
import ContextMenu from '../components/ContextMenu';
import ListItem from '../components/ListItem';
import ListItemSeparator from '../components/ListItemSeparator';

const initialScrollIndex = 6;

class MainScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      scrollIndex: 6
    };
  }

  static navigationOptions = {
    title: 'Main Screen',
  };

  _keyExtractor = (item, index) => item;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);
  _getItemLayout = (data, index) => ({length: 600, offset: 600 * index, index: index})
  _renderItem = ({item}) => (
    <ListItem
      id={item}
      weeks={Seq(new Array(differenceInCalendarWeeks(endOfMonth(item), startOfMonth(item)) + 1))
        .map((_,week) => (
          {days: Seq(eachDay(startOfMonth(item),endOfMonth(item))).filter((days) => (
            isSameWeek(days, addWeeks(item,week))))
            .map((day) => (format(day, 'YYYY-MM-DD')
            ))
          }
        ))
      }
      isThisMonth={isThisMonth(item)}
    />
  )

  componentDidMount() {
    setTimeout(() => {this.refList.scrollToIndex({animated: true, index: this.state.scrollIndex}), 300});
  }

  render() {  
    const calendar = this.props.calendar;
    const addMonthsAfter = this.props.addMonthsAfter;
    const windowidth = Dimensions.get('window').width;
    
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
          initialScrollIndex={this.state.scrollIndex - 1} // subtract 1 due to https://github.com/facebook/react-native/issues/13202
          //ItemSeparatorComponent={ListItemSeparator}
          onEndReached={addMonthsAfter}
          //showsVerticalScrollIndicator={false}
          windowSize={12}
          initialNumToRender={3}
          removeClippedSubviews={true}
          //onEndReachedThreshold={0.1}
        />
        <DocumentButton />
        <ContextMenu />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  calendar: state.calendar,
  documents: state.documents,
});

const mapDispatchToProps = dispatch => ({
  loadDocuments: () => dispatch({ type: 'loadDocuments' }),
  login: () => dispatch({ type: 'Login' }),
  addMonthsBefore: () => dispatch({ type: 'addMonthsBefore' }),
  addMonthsAfter: () => dispatch({ type: 'addMonthsAfter' }),
});


export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9977ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    alignSelf: 'stretch',

  },
  listContentContainer: {
  }
});

