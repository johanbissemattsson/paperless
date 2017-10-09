import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, Dimensions} from 'react-native';
import { Camera, FileSystem, Permissions } from 'expo';
import Svg, { Path } from 'react-native-svg';


class CameraView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    }

    this._takePicture = () => {
      if (this.camera) {
        this.camera.takePictureAsync().then(data => {
          this.props.dispatch(addPhoto(data));
          console.log(data);
        })
      }
      console.log("Take photo");
    }
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const cameraWidth = Dimensions.get('window').width;
    const cameraHeight = Dimensions.get('window').height;
    const overlayPathCoordinates = "M0,0H" + (cameraWidth) + "V" + (cameraHeight) + "H0z M300,100H30V400H300z";
    
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View/>      
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>      
    } else {
      return (
        <View style={styles.container}>
          <Camera
            style={[styles.camera, {width: cameraWidth, height: cameraHeight}]}
            ref={ref => {this.camera = ref;}}
            type={this.state.type}
          >
          </Camera>      
        </View>
      );
    }
  }
}

export default connect()(CameraView);


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: -1
  },
  camera: {
  },
  overlayContainer: {

  }
});