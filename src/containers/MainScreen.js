import React from 'react';
import { StyleSheet, Text, View, Button, VirtualizedList, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { format, differenceInWeeks, eachDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getDaysInMonth, setDate, getISOWeek, isSameWeek, addWeeks, isThisYear, isThisMonth, getDay } from 'date-fns';
import { Map, List, Seq } from 'immutable';

import DocumentButton from '../components/DocumentButton';
import ContextMenu from '../components/ContextMenu';
import ListItem from '../components/ListItem';
import ListItemSeparator from '../components/ListItemSeparator';

class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Main Screen',
  };

  _keyExtractor = (item, index) => item;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);
  _renderItem = ({item}) => (
    <ListItem
      id={item}
      name={isThisYear(item) ? format(item, 'MMMM') : format(item, 'MMM YYYY')}
      days={eachDay(startOfMonth(item), endOfMonth(item))}
      firstWeekday={getDay(startOfMonth(item))}
      isThisMonth={isThisMonth(item)}
      daySize={Dimensions.get('window').width / 7}
      windowSize={Dimensions.get('window').width}
      /*
        // maybe use differenceInCalendarWeeks instead?
        weeks={List(new Array(moment(endOfMonth(item)).monthWeek() + 1))
        .map((_,w) => (
          Seq(eachDay(startOfMonth(item),endOfMonth(item))).filter((d) => (
            isSameWeek(d, addWeeks(item,w))
          ))
        ))
      }*/
    />
  )

  render() {  
    const months = this.props.months;
    const addMonthAfter = this.props.addMonthAfter;

    return (
      <View style={styles.container}>
        <VirtualizedList 
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          data={months.get('inList')}
          renderItem={this._renderItem}
          getItem={this._getItem}
          getItemCount={this._getItemCount}
          keyExtractor={this._keyExtractor}
          ItemSeparatorComponent={ListItemSeparator}
          onEndReached={addMonthAfter}
          showsVerticalScrollIndicator={false}
        />
        <DocumentButton />
        <ContextMenu />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  months: state.months,
  documents: state.documents,
});

const mapDispatchToProps = dispatch => ({
  loadDocuments: () => dispatch({ type: 'loadDocuments' }),
  login: () => dispatch({ type: 'Login' }),
  addMonthBefore: () => dispatch({ type: 'addMonthBefore' }),
  addMonthAfter: () => dispatch({ type: 'addMonthAfter' }),
});


export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9900',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
  }
});

