import React from 'react';
import { StyleSheet, Text, View, Button, FlatList, VirtualizedList } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DocumentButton from './DocumentButton';
import ContextMenu from './ContextMenu';
import ListItem from './ListItem';
import ListItemSeparator from './ListItemSeparator';

class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Main Screen',
  };

  componentDidMount() {
    //const { loadDocuments } = this.props;
    //loadDocuments();
  }

  /* Following is an working example of using VirtualizedList, FlatList however seems to use VirtualizedList as well */
  /*
    <VirtualizedList 
      style={styles.list}
      contentContainerStyle={styles.listContentContainer}
      data={immutableData}
      renderItem={({item}) => {console.log(item);return <ListItem hej={item.get('key')} monthName={item.get('monthName')}/>}}
      getItem={(items, index) => immutableData.get(index)}
      getItemCount={(items) => (items.size || 0)}
      keyExtractor={(item, index) => String(index)}
      ItemSeparatorComponent={ListItemSeparator}
    />
  */

  render() {  
    const { navigate } = this.props.navigation;
    const documents = this.props.documents;
    const immutableDocumentsData = documents.get('visibleMonths');
    
    return (
      <View style={styles.container}>
        <FlatList 
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          data={immutableDocumentsData}
          renderItem={({item}) => <ListItem monthName={item.monthName}/>}
          keyExtractor={(item, index) => String(index)}
          ItemSeparatorComponent={ListItemSeparator}
        />
        <DocumentButton />
        <ContextMenu />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  documents: state.documents,  
});

const mapDispatchToProps = dispatch => ({
  loadDocuments: () => dispatch({ type: 'loadDocuments' }),
  login: () => dispatch({ type: 'Login' })
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
    alignSelf: 'stretch', 
  },
  listContentContainer: {
    alignItems: 'center'    
  }
});

