import React from 'react';
import { StyleSheet, Text, View, Button, VirtualizedList, Dimensions, FlatList } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { Map, List, Seq } from 'immutable';
import Frisbee from 'frisbee';

import DocumentContextMenu from '../components/DocumentContextMenu';

import { SELECT_DATE } from '../actionTypes';

class DocumentsView extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
    
    };
  }

  render() {  
    const windowWidth = Dimensions.get('window').width;    
    const windowHeight = Dimensions.get('window').height;
    const dayWidth = windowWidth / 7;
    
    return (
      <View style={[styles.container, {width: windowWidth, height: windowHeight - (dayWidth * 3) - (Constants.statusBarHeight * 2), top: Constants.statusBarHeight + dayWidth * 2}]}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          data={[{key: 'a'}, {key: 'b'}, {key: 'c'}, {key: 'd'}, {key: 'e'}, {key: 'f'}, {key: 'g'}, {key: 'h'}, {key: 'i'}, {key: 'j'}, {key: 'k'}, {key: 'l'}, {key: 'm'}, {key: 'n'}, {key: 'o'}, {key: 'p'}, {key: 'q'}, {key: 'r'}, {key: 's'}, {key: 't'}, {key: 'u'}, {key: 'v'}, {key: 'w'}, {key: 'x'}, {key: 'y'}, {key: 'z'}]}
          renderItem={({item}) => <Text style={styles.listItem}>{item.key}</Text>}
        />
        <DocumentContextMenu />
      </View>
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});


export default connect(mapStateToProps, mapDispatchToProps)(DocumentsView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    position: 'absolute',
    zIndex: 100,
    top: Constants.statusBarHeight

  },
  list: {
    flex: 1,
    alignSelf: 'stretch',
  },
  listContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {

  }
});