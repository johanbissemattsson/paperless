import React from 'react';
import { StyleSheet, Text, View, Button, VirtualizedList, Dimensions, Vibration } from 'react-native';
import { Camera, FileSystem, Permissions, Constants } from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { format, differenceInCalendarWeeks, eachDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getDaysInMonth, setDate, getISOWeek, isSameWeek, addWeeks, isThisYear, isThisMonth, isSameMonth, getDay } from 'date-fns';
import { Map, List, Seq } from 'immutable';

import DocumentButton from '../components/DocumentButton';
import ContextMenu from '../components/ContextMenu';
import ListItem from '../components/ListItem';
import ListItemSeparator from '../components/ListItemSeparator';
import { SELECT_DATE } from '../actionTypes';

class MainScreen extends React.Component {
  constructor(props, context) {
    super(props, context);

    const { calendar } = props;
    this.state = {
      scrollIndex: calendar.get('months').findIndex(item => item === format(calendar.get('selected'), 'YYYY-MM')),
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      cameraBusy: false,
      documentsInSelected: List.of( // Documents in selected (not yet synced)
        Map({
          pages: List(),
        })
      ),
      currentDocument: 0,      
    };
  }

  static navigationOptions = {
    title: 'Main Screen',
  };

  _keyExtractor = (item, index) => item;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);
  _getItemLayout = (data, index) => {
    const { calendar } = this.props;
    const weeksInMonth = differenceInCalendarWeeks(endOfMonth(data.get(index)), startOfMonth(data.get(index))) + 2;
    const windowWidth = Dimensions.get('window').width;
    const dayHeight = Dimensions.get('window').width / 7;
    const indexOfSelected = calendar.get('months').findIndex(item => item === format(new Date(), 'YYYY-MM'));
    const itemLength = 7 * dayHeight;
    return({
      length: itemLength, // + (index === indexOfSelected) && windowWidth,
      offset: itemLength * index, //+ (index > indexOfSelected) && windowWidth,
      index: index
    })
  }
  _renderItem = (({item}) => {
    const { calendar } = this.props;
    const { documentsInSelected, currentDocument } = this.state;
    const selected = calendar.get('selected');
    return (
      <ListItem
        id={item}
        weeks={List(new Array(differenceInCalendarWeeks(endOfMonth(item), startOfMonth(item)) + 1))
          .map((_,week) => (
            {days: Seq(eachDay(startOfMonth(item),endOfMonth(item))).filter((days) => (
              isSameWeek(days, addWeeks(item,week))))
              .map((day) => (format(day, 'YYYY-MM-DD')
              ))
            }
          ))
        }
        selected={isSameMonth(item, selected) && selected}
        onPress={this.onDatePress}
        documents={documentsInSelected}
        currentDocument={currentDocument}
      />
    )
  })

  onDocumentButtonPress = async () => {
    const { documentsInSelected, currentDocument } = this.state;
    if (this.refCamera && !this.state.cameraBusy) {
      this.setState({cameraBusy: true});      
      Vibration.vibrate();
      this.refCamera.takePictureAsync().then(data => {
        this.setState({cameraBusy: false, documentsInSelected: documentsInSelected.updateIn([currentDocument,'pages'], list => list.push(data))});
        //this.props.dispatch(takePhoto(data));         
        Vibration.vibrate();
      })
    }
  }

  onDatePress = ((day) => {
    const { selectDate } = this.props;
    selectDate(day);
  })

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  componentDidMount() {
    //setTimeout(() => {this.refList.scrollToIndex({animated: true, viewPosition: 0.5, index: this.state.scrollIndex}), 300});
  }

  render() {  
    const { calendar, addMonthsAfter } = this.props;
    const { hasCameraPermission } = this.state;    
    const cameraWidth = Dimensions.get('window').width;
    const cameraHeight = Dimensions.get('window').height;
    
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
          initialScrollIndex={this.state.scrollIndex - 1} // subtracting 1 due to https://github.com/facebook/react-native/issues/13202
          ItemSeparatorComponent={ListItemSeparator}
          onEndReached={addMonthsAfter}
          //showsVerticalScrollIndicator={false}
          windowSize={12}
          initialNumToRender={6}
          //removeClippedSubviews={true}
          //onEndReachedThreshold={0.1}
        />
        { hasCameraPermission === null 
          ? <View/>
          : (hasCameraPermission === false
            ? <Text>No access to camera</Text>
            : <View style={styles.cameraContainer}>
                <Camera
                  style={[styles.camera, {width: cameraWidth, height: cameraHeight}]}
                  ref={node => {this.refCamera = node;}}
                  type={this.state.type}
                />
              </View>
            )
        }
        <DocumentButton onPress={this.onDocumentButtonPress} cameraBusy={this.state.cameraBusy}/>
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
  selectDate: (date) => dispatch({type: SELECT_DATE, date: date}),
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
  },
  cameraContainer: {
    position: 'absolute',
    zIndex: -1
  },
  camera: {
  },  
});

/*
componentDidUpdate() {
    const index = calendar.get('months').findIndex(item => item === format(calendar.get('goTo').date, 'YYYY-MM'));
    this.refList.scrollToIndex({animated: true, viewPosition: 0.5, index: index});
}
  */
