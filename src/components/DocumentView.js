import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, Dimensions} from 'react-native';
import { Camera, FileSystem, Permissions } from 'expo';
import Svg, { Path } from 'react-native-svg';


class DocumentView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const windowWidth = Dimensions.get('window').width;    
    return (<View style={styles.container} height={windowWidth} />);
  }
}

export default connect()(DocumentView);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000'
  }
});