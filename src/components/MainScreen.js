import React from 'react';
import { StyleSheet, Text, View, Button, SectionList } from 'react-native';
import { Constants } from 'expo';

import DocumentButton from './DocumentButton';
import ContextMenu from './ContextMenu';


export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Main Screen',
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <SectionList
          style={styles.list}
          renderItem={({item}) => <View style={styles.listItem}><Text>{item.title}</Text></View>}
          renderSectionHeader={({section}) => <View style={styles.listHeader}><Text>{section.key}</Text></View>}
          sections = {[
            {data: [{title: 'Title texaaaaaaaaaaaaaaat', key: 's1item1'},{title: 'Title text2', key: 's1item2'},{title: 'Title text3', key: 's1item3'}], key: 'section1'},
            {data: [{title: 'Title text', key: 's2item1'},{title: 'Title text2', key: 's2item2'},{title: 'Title text3', key: 's2item3'}], key: 'section2'},
            {data: [{title: 'Title text', key: 's3item1'},{title: 'Title text2', key: 's3item2'},{title: 'Title text3', key: 's3item3'}], key: 'section3'},
          ]}
        />
        <DocumentButton />
        <ContextMenu />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9900',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    alignSelf: 'stretch', 
  },
  listHeader: {
    backgroundColor: '#ff0000',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight
  },
  listItem: {
    height: 100,
    backgroundColor: '#00ff00',
    alignItems: 'center',
  }
});
