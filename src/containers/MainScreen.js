import React from 'react';
import { StyleSheet, Text, View, Button, VirtualizedList, Dimensions, Vibration } from 'react-native';
import { Camera, FileSystem, Permissions, Constants } from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';

import CalendarView from './CalendarView';
import DocumentsView from './DocumentsView';
import CameraView from './CameraView';
import ContextMenu from '../components/ContextMenu';

class MainScreen extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {

    };
  }

  static navigationOptions = {
    title: 'Main Screen',
  };

  render() {
    return (
      <View style={styles.container}>
        <DocumentsView />
        <CalendarView />
        <CameraView />
        <ContextMenu />
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

/*
componentDidUpdate() {
    const index = calendar.get('months').findIndex(item => item === format(calendar.get('goTo').date, 'YYYY-MM'));
    this.refList.scrollToIndex({animated: true, viewPosition: 0.5, index: index});
}
  */
