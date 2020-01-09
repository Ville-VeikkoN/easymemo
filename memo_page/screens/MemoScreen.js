import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, Platform, TouchableOpacity, Image } from 'react-native';
import * as Calendar from 'expo-calendar';
import DatePicker from 'react-native-datepicker'
import { FlatList } from 'react-native-gesture-handler';
import Swipeout from 'react-native-swipeout';
import { Card } from 'react-native-elements';
import MemoDialog from '../components/MemoDialog';
import MemoModal from '../components/MemoModal';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function MemoScreen(props) {

  const [calendarId, setCalendarId] = React.useState('');
  const [startDate, setStartDate] = React.useState(new Date(new Date().setDate(new Date().getDate()-1)));
  const [endDate, setEndDate] = React.useState(new Date(new Date().setDate(new Date().getDate()+1)));
  const [events, setEvents] = React.useState([]);
  const [showDialog, setShowDialog] = React.useState(false);
  const [modalInfo, setModalInfo] = React.useState({
    showModal: false,
    memo: null
  });

  useEffect(() => {
    // Calendar.getCalendarsAsync()
    //   .then(res => {
    //     for(cal of res) {
    //       if(cal.title == 'Expo Calendar') {
    //         Calendar.deleteCalendarAsync(cal.id)
    //       }
    //     }
    //   })
    if(!calendarId) {
      Calendar.requestPermissionsAsync()
      .then(res => {
        if(res.granted) {
          AsyncStorage.getItem('calendarID')
          .then(res => {
            if(res == null) {
              createCalendar();
            } else {
              setCalendarId(res);
            }
          })
        }
      })
    } else {
      getEvents();
    }
  },[calendarId])

  async function createCalendar() {
    const defaultCalendarSource =
      Platform.OS === 'ios'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };
    const newCalendarID = await Calendar.createCalendarAsync({
      title: 'Expo Calendar',
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: 'internalCalendarName',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    AsyncStorage.setItem('calendarID', newCalendarID);
    setCalendarId(newCalendarID);
  }

  function getEvents() {
    Calendar.getEventsAsync([calendarId], new Date(startDate), new Date(endDate))
      .then(res => {
        setEvents(res);
      });
  }

  function handleDialogClose() {
    setShowDialog(false);
  }

  function handleModalClose() {
    setModalInfo({
      ...modalInfo,
      showModal: false,
    });
  }

  function getParsedDate(date) {
    date = String(date).split('T');
    var splittedDate = String(date[0]).split('-');
    return splittedDate[2] + '.' + splittedDate[1] + '.' + splittedDate[0];
  };

  function addEvent(memo) {
    Calendar.createEventAsync(calendarId, {
      title: memo.title,
      startDate: memo.startDate,
      endDate: memo.endDate,
      accessLevel: 'default',
      notes: memo.notes,
      alarms: memo.alarm,
      allDay: memo.allDay,
    })
    getEvents();
  }

  function deleteEvent(event) {
    Calendar.deleteEventAsync(event.id);
    getEvents();
  }

  function renderStartDatePicker() {
    return(
      <DatePicker
        style={{width: 150}}
        date={startDate}
        mode="date"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
        }}
        onDateChange={(date) => {
          setStartDate(date);
        }}
      />
    )
  }

  function renderEndDatePicker() {
    return(
      <DatePicker
        style={{width: 150}}
        date={endDate}
        mode="date"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
        }}
        onDateChange={(date) => {
          setEndDate(date);
        }}
      />
    )
  }

  let swipeBtns = (item) => [
    {
      text: 'Delete',
      color: 'red',
      backgroundColor: '#fff',
      onPress: () => deleteEvent(item),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.datePickersContainer}>
        <View style = {styles.datePickerContainer}>
          <Text>From</Text>
          {renderStartDatePicker()}
        </View>
        <View style = {styles.datePickerContainer}>
          <Text>To</Text>
          {renderEndDatePicker()} 
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => getEvents()}
          style={{justifyContent:'flex-end'}}>
          <MaterialCommunityIcons name='calendar-search' size={40} color='#3e64ff' />
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({item}) => 
          <Swipeout right={swipeBtns(item)}
            autoClose={true}
            backgroundColor= 'transparent'>
            <TouchableOpacity onPress={() => {
              setModalInfo({
                showModal: true,
                memo: item
              });
            }}>
              <Card containerStyle={styles.cardContainer}>
                <View style={styles.flatList}>
                  <Text style={{fontSize:20}}>{item.title}</Text>
                  <Text style={{fontSize:15}}>{getParsedDate(item.startDate)}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </Swipeout>
        }
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setShowDialog(true);
        }}
        style={styles.TouchableOpacityStyle}>
        <Ionicons name='md-add-circle' size={60} color='#3e64ff' />
      </TouchableOpacity>
      {modalInfo.showModal && (
        <MemoModal 
          memo={modalInfo.memo} 
          handleClose={handleModalClose}/>
      )}
      {showDialog && (
        <MemoDialog 
          handleClose={handleDialogClose} 
          saveData={addEvent} 
          visible={showDialog}/>
      )}
    </View>
  );
}

MemoScreen.navigationOptions = {
  title: 'Memos',
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
  cardContainer: {
    backgroundColor: '#5edfff',
    minHeight:100,
  },
  flatList: {
    padding: 10,
    minHeight: 44,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
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
  datePickersContainer: {
    flexDirection: 'row',
    marginLeft:10,
    marginRight:10,
  },
  datePickerContainer: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  }
});