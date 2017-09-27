import React from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
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
    const { loadDocuments } = this.props;
    loadDocuments();
  }
  
  render() {  
    const { navigate } = this.props.navigation;
    const documents = this.props.documents;

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          data={documents.data}
          renderItem={({item}) => <ListItem month={item.title}/>}
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

