import React from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { Constants } from 'expo';

import DocumentButton from './DocumentButton';
import ContextMenu from './ContextMenu';
import ListItem from './ListItem';
import ListItemSeparator from './ListItemSeparator';

export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Main Screen',
  };
  
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          renderItem={({item}) => <ListItem month={item.title}/>}
          ItemSeparatorComponent={ListItemSeparator}
          data = {
            [{title: 'Title text', month:'111', documents:'', key: 's1item1'},{title: 'Title textaaaa 2', month:'222', documents:'', key: 's1item2'},{title: 'Title text3',month:'111', documents: '', key: 's1item3'}]
          }
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
  listContentContainer: {
    alignItems: 'center'    
  }
  
});
