import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, FlatList, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import NoteDialog from '../components/NoteDialog'
import NoteModal from '../components/NoteModal'
import { Card } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import { object } from 'prop-types';
import NoteItem from '../NoteItem';

export default function NoteScreen() {

  const [showDialog, setShowDialog] = React.useState(false);
  const [allObjects, setAllObjects] = React.useState([])
  const [modalInfo, setModalInfo] = React.useState({
    showModal: false,
    note: null
  });

  useEffect(() => {
    console.log("useeffect")
    _getAllObjects();
  }, [])

  const _storeData = (data) => {
    AsyncStorage.getAllKeys().then((res) => {
      const nextKey = String(res.length);
      try {
        AsyncStorage.setItem(data.title, JSON.stringify(data)).then(_getAllObjects);
      } catch(error) {
        console.log(error);
      }
    })

  }

  const _getAllKeys = () => {
    try {
      AsyncStorage.getAllKeys().then((res) => console.log(res));
    } catch(error) {
      console.log(error);
    }
  }

  const _getAllObjects = () => {
    setAllObjects([])
    try {
      AsyncStorage.getAllKeys().then((res) => {
        var tempAllObjects = [];  
        for(key of res) {
          AsyncStorage.getItem(key)
            .then((item) => {
              tempAllObjects.push(JSON.parse(item))
              if(tempAllObjects.length == res.length) {
                tempAllObjects.sort(function(a,b) {
                  if(a.date <  b.date) {
                    return -1;
                  }
                })
                setAllObjects(tempAllObjects);
              }
            })
        }
      });

    } catch(error) {
      console.log(error);
    }
  }

  const _clearData = (key) => {
    try {
      console.log(key);
      AsyncStorage.removeItem(key).then(_getAllObjects);
    } catch(error) {
      console.log(error);
    }
  }

  const _clearAll = () => {
    try {
      AsyncStorage.clear().then(console.log('Done'));
    } catch(error) {
      console.log(error);
    }
  }

  let swipeBtns = (item) => [{
    text: 'Delete',
    color: 'red',
    backgroundColor: '#fff',
    onPress: () => { _clearData(item.title) }
  }];

  function handleModalClose() {
    setModalInfo({
      ...modalInfo,
      showModal: false,
    });
  }

  function handleDialogClose() {
    setShowDialog(false);
  }

  return (
    <View style={styles.container}>
      <Button title="Save" onPress={() => {
        setShowDialog(true);
      }}></Button>
      <Button title="Clear" onPress={_clearAll}></Button>
      <Button title="Get All Keys" onPress={_getAllKeys}></Button>
      <Button title="Get All Objects" onPress={_getAllObjects}></Button>
      <FlatList
          data={allObjects}
          keyExtractor={item => item.title}
          renderItem={({item}) => 
          <Swipeout right={swipeBtns(item)}
            autoClose={true}
            backgroundColor= 'transparent'>
            <TouchableOpacity onPress={() => {
              setModalInfo({
                showModal: true,
                note: item
              });
              console.log(modalInfo.showModal, 'modalinfo')
              console.log(modalInfo.note, 'modalinfo')
              }}>
              {console.log(item.style.backgroundColor)}
              <Card containerStyle={{backgroundColor: item.style.backgroundColor}}>
                <View style={styles.flatList}>
                  <Text style={{fontSize: 18}}>{item.title}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </Swipeout>
          }
      />
      {modalInfo.showModal && <NoteModal note={modalInfo.note} handleClose={handleModalClose}></NoteModal>}
      {showDialog && <NoteDialog handleClose={handleDialogClose} saveData={_storeData} visible={showDialog}></NoteDialog>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 2,
    width: 200,
  },
  flatList: {
    padding: 10,
    minHeight: 44,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignContent: 'stretch',
  },
});
