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

  _keyExtractor = (item, index) => item;
  _getItem = (items, index) => items.get(index);
  _getItemCount = (items) => (items.size || 0);
  _renderItem = ({item}) => (
     <ListItem id={item}/>
  )

  render() {  
    const months = this.props.months;
    const addMonthAfter = this.props.addMonthAfter;

    return (
      <View style={styles.container}>
        <VirtualizedList 
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          data={months.get('inList')}
          renderItem={this._renderItem}
          getItem={this._getItem}
          getItemCount={this._getItemCount}
          keyExtractor={this._keyExtractor}
          ItemSeparatorComponent={ListItemSeparator}
          onEndReached={addMonthAfter}
          showsVerticalScrollIndicator={false}
        />
        <DocumentButton />
        <ContextMenu />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  months: state.months,
  documents: state.documents,
});

const mapDispatchToProps = dispatch => ({
  loadDocuments: () => dispatch({ type: 'loadDocuments' }),
  login: () => dispatch({ type: 'Login' }),
  addMonthBefore: () => dispatch({ type: 'addMonthBefore' }),
  addMonthAfter: () => dispatch({ type: 'addMonthAfter' }),
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

