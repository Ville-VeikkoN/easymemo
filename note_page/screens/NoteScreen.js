import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, FlatList, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import NoteDialog from '../components/NoteDialog'
import NoteModal from '../components/NoteModal'
import { Card } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import { object } from 'prop-types';
import NoteItem from '../NoteItem';

export default function NoteScreen() {
  /*


      REACT-NATIVE-SWIPEOUT IS DEPRECATED, USE react-native-swipe-list-view


  */
  const [showDialog, setShowDialog] = React.useState(false);
  const [allObjects, setAllObjects] = React.useState([])
  const [modalInfo, setModalInfo] = React.useState({
    showModal: false,
    note: null
  });

  useEffect(() => {
    _getAllObjects();
  }, [])

  const _storeData = (data) => {
    try {
      AsyncStorage.getItem(data.title)
        .then(res => {
          if(res != null) {
            alert('Note with same title already exists')
          } else {
            AsyncStorage.setItem(data.title, JSON.stringify(data)).then(_getAllObjects).then(res => console.log(res));
          }
      })
    } catch(error) {
      console.log(error);
    }
  }

  const _getAllObjects = () => {
    var tempAllObjects = [];  
    try {
      AsyncStorage.getAllKeys().then((res) => {
        if(res.length == 0) {
          setAllObjects(tempAllObjects);
        }
        for(key of res) {
          AsyncStorage.getItem(key)
            .then((item) => {
              tempAllObjects.push(JSON.parse(item));
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

  const _clearItem = (key) => {
    try {
      AsyncStorage.removeItem(key).then(_getAllObjects);
    } catch(error) {
      console.log(error);
    }
  }

  let swipeBtns = (item) => [{
    text: 'Delete',
    color: 'red',
    backgroundColor: '#fff',
    onPress: () => { _clearItem(item.title) }
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
      <Button title="Add" onPress={() => {
        setShowDialog(true);
      }}></Button>
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
              }}>
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
