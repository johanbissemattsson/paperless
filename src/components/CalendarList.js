import React from 'react';
import { StyleSheet, Text, View, VirtualizedList } from 'react-native';
import { List } from 'immutable';
import { eachDay } from 'date-fns';

import CalendarListWeek from '../components/CalendarListWeek';

export default class CalendarList extends React.Component {

  _keyExtractor = (item, index) => item;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);

  _renderItem = ({item, index}) => {
    const {dayHeight, onDatePress} = this.props;
    return (
      <CalendarListWeek week={item} height={dayHeight} onDatePress={onDatePress}/>
    );
  }

  _getItemLayout = (item, index) => ({length: this.props.dayHeight, offset: this.props.dayHeight * index, index });

  _onEndReached = () => {
    const {onCalendarEndReached, before} = this.props;
    onCalendarEndReached(before);
  }

  render() {
    const { before, after, weeks } = this.props;

    return(
        <View style={styles.container}>
          <VirtualizedList
            ref={node => this.refVirtualizedList = node}
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            inverted={before} // Reverses the direction of scroll (used for triggering onEndReached on top)
            data={before ? weeks.reverse() : weeks} // Reverse the listed items (used in conjunction with above)
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            getItem={this._getItem}
            getItemCount={this._getItemCount}
            getItemLayout={this._getItemLayout}
            renderItem={this._renderItem}
            onEndReached={this._onEndReached}
            debug={true} 
            //horizontal={true} // debug visar rätt ifall horizontal = true
            nestedScrollEnabled={true} // https://github.com/facebook/react-native/pull/18299

          />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  list: {

  },
  listContentContainer: {
  },
});