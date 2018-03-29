import React from 'react';
import { StyleSheet, Text, View, Button, VirtualizedList, Dimensions, Vibration } from 'react-native';
import { Camera, FileSystem, Permissions, Constants } from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';

import CalendarView from './CalendarView';
import DocumentsView from './DocumentsView';
import CameraView from './CameraView';

class MainScreen extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {

    };
  }

  static navigationOptions = {
    title: 'Main Screen',
  };

  /*
    <DocumentsView />
    <CalendarView />
    <CameraView />
  */
 
  render() {
    return (
      <View style={styles.container}>
        <CalendarView />
        <CameraView />
      </View>
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9977ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});