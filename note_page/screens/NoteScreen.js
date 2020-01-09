import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, FlatList, TextInput, ScrollView, TouchableOpacity, CheckBox } from 'react-native';
import NoteDialog from '../components/NoteDialog'
import NoteModal from '../components/NoteModal'
import { Card } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import { object } from 'prop-types';
import NoteItem from '../NoteItem';
import { Ionicons } from '@expo/vector-icons';

export default function NoteScreen(props) {
  /*


      REACT-NATIVE-SWIPEOUT IS DEPRECATED, USE react-native-swipe-list-view


  */
  const [dialogInfo, setDialogInfo] = React.useState({
    showDialog: false,
    editableNote: null
  });
  const [allObjects, setAllObjects] = React.useState([])
  const [modalInfo, setModalInfo] = React.useState({
    showModal: false,
    note: null
  });

  useEffect(() => {
    //  try {
    //    AsyncStorage.clear()
    //   AsyncStorage.getAllKeys()
    //     .then(res => console.log(res))
    //  } catch(error) {
    //    console.log(error);
    //  }
    _getAllObjects();
  }, [])

  const _storeData = (data) => {
    storedList = {'list': []}
    try {
      list = allObjects;
      list.push(data);
      AsyncStorage.getItem('notes')
        .then(res => {
          storedList.list = list;
          if(res !== null) {
            AsyncStorage.mergeItem('notes', JSON.stringify(storedList))
              .then(_getAllObjects)
          } else {
            AsyncStorage.setItem('notes', JSON.stringify(storedList))
              .then(_getAllObjects)
          }
      })
    } catch(error) {
      console.log(error);
    }
  }

  const _getAllObjects = () => {
    list = [];
    try {
      AsyncStorage.getItem('notes')
        .then((res) => {
          if(res !== null) {
            list = JSON.parse(res)
            setAllObjects(list.list);
          }
          // for(key of res) {
          //   AsyncStorage.getItem(key)
          //     .then((item) => {
          //       tempAllObjects.push(JSON.parse(item));
          //       if(tempAllObjects.length == res.length) {
          //         tempAllObjects.sort(function(a,b) {
          //           if(a.date <  b.date) {
          //             return -1;
          //           }
          //         })
          //         setAllObjects(tempAllObjects);
          //       }
          //   })
          // }
      });
    } catch(error) {
      console.log(error);
    }
  }

  const _clearItem = (itemToDelete) => {
    tempAllObjects = allObjects;
    storedList = {'list': []}
    storedList.list = tempAllObjects.filter(item => item.title !== itemToDelete.title);
    try {
      AsyncStorage.mergeItem('notes', JSON.stringify(storedList))
        .then(_getAllObjects);
    } catch(error) {
      console.log(error)
    }
  }

  function getIndex(item) {
    return allObjects.findIndex(obj => obj.title === item.title);
  }

  const _mergeItem = (item) => {
    tempAllObjects = allObjects;
    index = getIndex(item);
    storedList = {'list': []}
    tempAllObjects.splice(index,1,item);
    storedList.list = tempAllObjects;
    try {
      AsyncStorage.mergeItem('notes',JSON.stringify(storedList))
        .then(_getAllObjects);
    } catch(error) {
      console.log(error);
    }
  }

  let swipeBtns = (item) => [
    {
      text: 'Edit',
      color: 'green',
      backgroundColor: '#fff',
      onPress: () => {
        setDialogInfo({
          showDialog: true,
          editableNote: item,
        })
      }
    },
    {
      text: 'Delete',
      color: 'red',
      backgroundColor: '#fff',
      onPress: () => { _clearItem(item) }
    },
  ];

  function handleModalClose() {
    setModalInfo({
      ...modalInfo,
      showModal: false,
    });
  }

  function handleDialogClose() {
    setDialogInfo({
      ...dialogInfo,
      showDialog: false,
    });
  }

  return (
    <View style={styles.container}>
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
                  <Text style={item.checked ? {textDecorationLine: 'line-through', fontSize: 18} : {fontSize: 18}}>{item.title}</Text>
                  <CheckBox value={item.checked} onValueChange={() => {
                    item.checked = !item.checked
                    _mergeItem(item)
                  }}/>
                </View>
              </Card>
            </TouchableOpacity>
          </Swipeout>
        }
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setDialogInfo({
            showDialog: true,
            editableNote: null
          });
        }}
        style={styles.TouchableOpacityStyle}>
        <Ionicons name='md-add-circle' size={60} color='#3e64ff' />
      </TouchableOpacity>
      {modalInfo.showModal && (
        <NoteModal 
          note={modalInfo.note} 
          handleClose={handleModalClose}/>
      )}
      {dialogInfo.showDialog && (
        <NoteDialog 
          handleClose={handleDialogClose} 
          saveData={_storeData} 
          visible={dialogInfo.showDialog}
          editableNote={dialogInfo.editableNote}
          editData={_mergeItem}/>
      )}
    </View>
  );
}

NoteScreen.navigationOptions = {
  title: 'Notes',
  headerStyle: {
    backgroundColor: '#5edfff'
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecfcff',
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
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
});
