import React, {useState, useEffect, useRef} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Camera} from 'expo-camera';

const width = Dimensions.get('window').width;

const CameraModule = (props) => {
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => {
        props.setModalVisible();
      }}>
      <Camera
        style={{flex: 1}}
        ratio="16:9"
        flashMode={Camera.Constants.FlashMode.off}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: 'black',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Button
              onPress={() => {
                props.setModalVisible();
              }}
              title="Close"
              color="#841584"
              style={{marginLeft: 12}}
            />
            <TouchableOpacity
              onPress={async () => {
                if (cameraRef) {
                  let photo = await cameraRef.takePictureAsync();
                  props.setImage(photo);
                  props.setList(photo);
                  props.setModalVisible();
                }
              }}>
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 50,
                  borderColor: 'white',
                  height: 50,
                  width: 50,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                  marginTop: 16,
                }}>
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 50,
                    borderColor: 'white',
                    height: 40,
                    width: 40,
                    backgroundColor: 'white',
                  }}></View>
              </View>
            </TouchableOpacity>
            <Button
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
                );
              }}
              title={type === Camera.Constants.Type.back ? 'Front' : 'Back '}
              color="#841584"
              style={{marginRight: 12}}
            />
          </View>
        </View>
      </Camera>
    </Modal>
  );
};

const ImageModal = (props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => {
        props.setModalVisible();
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          width: 400,
          height: 400,
          alignSelf: 'center',
        }}>
        <Image
          source={{uri: props.showPhoto}}
          style={{width: 300, height: 300}}
        />
        <View
          style={{
            backgroundColor: 'black',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Button
            onPress={() => {
              props.setModalVisible();
            }}
            title="Close"
            color="#841584"
            style={{marginLeft: 12}}
          />
        </View>
      </View>
    </Modal>
  );
};

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [camera, setShowCamera] = useState(false);
  const [photoModal, setShowModal] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [list, setList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(4);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const imageSelect = (item) => {
    setShowModal(true);
    setSelectedImage(item);
  };
  const handleClickBackward = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleClickForward = () => {
    // setIncrementCount(incrementCount => incrementCount + 1)
    // var n = (currentPage * postsPerPage)-postsPerPage;
    var n = (currentPage * postsPerPage) / 4;
    console.log('n', n);
    setCurrentPage(currentPage + 1);
  };
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = list.slice(indexOfFirstPost, indexOfLastPost);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          backgroundColor: '#eeee',
          width: 120,
          height: 120,
          marginBottom: 8,
          borderRadius: 100,
        }}>
        <TouchableOpacity>
          <Image
            source={{uri: image}}
            style={{width: 120, height: 120, borderRadius: 100}}
          />
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 20}}>
        <Button
          onPress={() => {
            setShowCamera(true);
          }}
          title="Camera"
          color="#841584"
          style={{width: '30%', marginTop: 16, marginBottom: 20}}
        />
      </View>
      {list !== [] ? (
        <View>
          <View
            style={{width: width, paddingHorizontal: 10, paddingVertical: 20}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={32}
              showsHorizontalScrollIndicator={false}>
              {currentPosts.map((item, i) => (
                <TouchableOpacity
                  onPress={() => {
                    imageSelect(item);
                  }}
                  key={i}>
                  <Image
                    source={{uri: item}}
                    style={{width: 80, height: 80, marginLeft: 5}}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      ) : null}
      {list.length !== 0 ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            width: width,
            paddingHorizontal: 10,
          }}>
          <View>
            <Button
              title="Prev"
              color="#841584"
              style={{width: '30%'}}
              onPress={handleClickBackward}
            />
          </View>
          <View>
            <Button
              title="Next"
              color="#841584"
              style={{width: '30%'}}
              onPress={handleClickForward}
            />
          </View>
        </View>
			) : 
			<View style={{ justifyContent: 'center', alignItems: 'center'}}>
				<Text>Please click some photos first</Text>
			</View>
			}
      {camera && (
        <CameraModule
          showModal={camera}
          setModalVisible={() => setShowCamera(false)}
          setImage={(result) => setImage(result.uri)}
          setList={(result) => setList([...list, result.uri])}
        />
      )}
      {photoModal && (
        <ImageModal
          showPhoto={selectedImage}
          setModalVisible={() => setShowModal(false)}
        />
      )}
    </View>
  );
}
