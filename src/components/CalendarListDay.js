import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableNativeFeedback, Platform} from 'react-native';
import { format } from 'date-fns';

export default class CalenderListDay extends React.Component {

  _onPress = (date) => {this.props.onDatePress(date);} // consider using context instead due to performance? Notably faster just to use console log here instead of onDatePress(date)

  render() {
    const { day, partOfSelectedWeek, height } = this.props;
    const selected = day.get('selected');
    const date = day.get('date');

    return (
      <View style={[styles.container, (partOfSelectedWeek && selected && styles.selectedContainer)]}>
        <TouchableNativeFeedback onPress={() => this._onPress(date)} background={TouchableNativeFeedback.SelectableBackground()} >
          <View style={[styles.day, {height: height}]}><Text style={[styles.date, (partOfSelectedWeek && selected && styles.selectedDate)]}>{format(date,'YY M D')}</Text></View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

CalenderListDay.propTypes = {
  day: PropTypes.string.isRequired,
  selected: PropTypes.PropTypes.bool.isRequired,
  onDatePress: PropTypes.func.isRequired,
  dayHeight: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: (1 / 7),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(135, 102, 238, 0.5)'
  },
  selectedContainer: {
    backgroundColor: 'transparent',
  },
  selectedWeek: {},
  selectedMonth: {
    backgroundColor: 'rgba(135, 102, 238, 0.95)'
  },
  day: {
    flex: 1,
    alignItems: 'center',    
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  date: {},
  selectedDate: {
    color: '#9977ff'
  },
});