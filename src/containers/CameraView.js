import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, Dimensions} from 'react-native';
import { Camera, Permissions } from 'expo';

class CameraView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    }
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;     
    const cameraWidth = Dimensions.get('window').width;
    const cameraHeight = Dimensions.get('window').height;
    
    return (
    <View style={styles.container}>
      { hasCameraPermission === null 
        ? <View/>
        : (hasCameraPermission === false
          ? <Text>No access to camera</Text>
          : <Camera
              style={[styles.camera, {width: cameraWidth, height: cameraHeight}]}
              ref={node => {this.refCamera = node;}}
              type={this.state.type}
            />
          )
      }
    </View>
    );
  }
}

export default connect()(CameraView);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: -1
  }
});