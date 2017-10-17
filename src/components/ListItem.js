import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, Platform, ScrollView, Image, VirtualizedList} from 'react-native';
import { List } from 'immutable';
import { format, isThisYear, isEqual, isToday, isPast, isSameWeek, isAfter} from 'date-fns';
import { LinearGradient, Constants } from 'expo';

export default class ListItem extends React.Component {
  _renderCameraOverlay = (() => {
    return (
      <View style={[styles.cameraOverlay, {minHeight: Dimensions.get('window').height - Math.round(Dimensions.get('window').width / 7) * 2 - Constants.statusBarHeight}]}>
        <Text>Hej</Text>
      </View>
    )
  });


  _keyExtractor = (item, index) => index;
  _getItem = (items, index) => {/* console.log('HEJEJEJEJEJE: ',items.get(index)); */ return items.get(index)};
  _getItemCount = (items) => (items.size || 0);
  _renderItem = (({item, index}) => {
    return (
      <Image style={styles.image} source={{uri: item.uri}} key={index} />
    )
  })  

  _renderDocumentOverlay = (() => {
    const { documents, currentDocument } = this.props;
    return (
      <View style={[styles.documentOverlay]}>
          {documents.map((documentItem, index) => {
            /*
            return(
              <ScrollView key={index} style={styles.pageList}>
                {[documentItem.get('pages').map((pageItem, indexa) => (
                  <Image style={styles.image} source={{uri: pageItem.uri}} key={indexa} />
                ))]}
              </ScrollView>              
            );
            */
            return (
              <VirtualizedList
                ref={node => this.refPageList = node}
                style={styles.pageList}
                contentContainerStyle={styles.pageListContentContainer}
                ListFooterComponent={(<Text>Footer</Text>)}
                ListHeaderComponent={(<Text>Header</Text>)}
                data={documentItem.get('pages')}
                renderItem={this._renderItem}
                getItem={this._getItem}
                getItemCount={this._getItemCount}
                keyExtractor={this._keyExtractor}
                key={index}
                //horizontal={true}
              />
            )
          })}
      </View>            
    )
  });

  componentDidMount() {
    //this.refPageList.setNestedScrollingEnabled(true);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { selected, documents } = this.props;
    if (selected !== nextProps.selected) {
      console.log("render because of selected");
      return true;      
    } else if (selected && !documents.equals(nextProps.documents)) {
      console.log("render because of documents");
      return true;    
    }
    return false;
  }

  render() {
    const { id, weeks, selected, onPress, documents } = this.props;
    const windowWidth = Dimensions.get('window').width;
    const dayHeight = Math.round(windowWidth / 7);
    return (
      <View style={[styles.container, selected && styles.selectedContainer, {minHeight: dayHeight * 7}]}>
        <View style={[styles.header, {height: dayHeight}, selected && styles.selectedHeader]}>
            <View style={[styles.titleContainer, selected && styles.selectedTitleContainer]}>
              <Text>{isThisYear(id) ? format(id, 'MMMM') : format(id, 'MMM YYYY')}</Text>
            </View>
        </View>
        <View style={[styles.month]} >
          {weeks.map((week, index) => (
            [
              selected && isSameWeek(week.days.first(), selected) && /* !documents.isEmpty() && */ (
                this._renderDocumentOverlay()
              ),
              selected && isSameWeek(week.days.first(), selected) && (
                this._renderCameraOverlay()
              ),
              <View style={[styles.week, (index === 0 && styles.firstWeekInMonth), selected && isSameWeek(week.days.first(), selected) && styles.selectedWeek]} key={index}>
                {week.days.map((day, index) => {
                  const isSelectedDay = selected && isEqual(day, selected);
                  const isPastDay = isPast(day) && !isToday(day);
                  return (
                    <TouchableNativeFeedback onPress={((e) => onPress(day))} background={TouchableNativeFeedback.SelectableBackground()} key={day}>
                      <View style={[styles.day, {height: dayHeight}, (isSelectedDay && styles.selectedDay), /* (selected && ((isSameWeek(day, selected) && isAfter(day, selected)) || isEqual(day, selected)) && {marginTop: dayHeight * 8}) */ ]}>
                        <Text style={[styles.date, isPastDay && styles.pastDate, (isSelectedDay && styles.selectedDate)]}>{format(day,'D')}</Text>
                      </View>
                    </TouchableNativeFeedback>                    
                  )
                })}
              </View>
            ]
          ))}
        </View>
      </View>
    );
  }
}

ListItem.propTypes = {
  id: PropTypes.string.isRequired,
  weeks: PropTypes.instanceOf(List).isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onPress: PropTypes.func.isRequired  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',    
    alignSelf: 'stretch',
    backgroundColor: '#8766ee'    
  },
  selectedContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',        
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#8766ee'    
  },
  titleContainer: {
    backgroundColor: '#9977ff',
    borderRadius: 100,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 1,
  },
  selectedTitleContainer: {
  },
  selectedHeader: {
  },
  gradient: {
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  sameWeek: {

  },
  month: {
    alignItems: 'stretch',
    justifyContent: 'center',
    alignSelf: 'stretch',  
  },
  week: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: '#8766ee'    
  },
  selectedWeek: {
    backgroundColor: 'transparent',
  },
  day: {
    flex: (1 / 7),
    alignItems: 'center',    
    justifyContent: 'center',
    backgroundColor: 'rgba(135, 102, 238, 1)'    
  },
  selectedDay: {
    backgroundColor: 'transparent',
  },
  date: {},
  selectedDate: {
    color: '#9977ff'
  },
  pastDate: {
    color: 'rgba(0,0,0,0.25)'
  },
  firstWeekInMonth: {
    justifyContent: 'flex-end'
  },
  image: {
    width: 200,
    height: 100
  },
  documentList: {height: 500},
  pageList: {height:300}
});