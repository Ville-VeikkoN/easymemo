import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, Platform, TouchableOpacity } from 'react-native';
import * as Calendar from 'expo-calendar';
import DatePicker from 'react-native-datepicker'
import { FlatList } from 'react-native-gesture-handler';
import Swipeout from 'react-native-swipeout';
import { Card } from 'react-native-elements';
import MemoDialog from '../components/MemoDialog';
import MemoModal from '../components/MemoModal';


export default function MemoScreen() {

  const [calendarId, setCalendarId] = React.useState('');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
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

    Calendar.requestPermissionsAsync()
    .then(res => {
      if(res.granted) {
        AsyncStorage.getItem('calendarID')
        .then(res => {
          if(res == null) {
            createCalendar();
          } else {
            setCalendarId(res);
            getEvents();
          }
        })
      }
    })

  },[])

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
    console.log(newCalendarID)
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
    console.log(memo)
    Calendar.createEventAsync(calendarId, {
      title: memo.title,
      startDate: memo.startDate,
      endDate: memo.endDate,
      accessLevel: 'default',
      notes: memo.notes,
      alarms: memo.alarm,
      allDay: memo.allDay,
    })
  }

  function deleteEvent(event) {
    Calendar.deleteEventAsync(event.id);
    getEvents();
  }

  function renderStartDatePicker() {
    return(
      <DatePicker
        style={{width: 200}}
        date={startDate}
        mode="date"
     //   format="DD-MM-YYYY"
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
        style={{width: 200}}
        date={endDate}
        mode="date"
      //  format="DD-MM-YYYY"
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
      <Button title='press' onPress={() => getEvents()}></Button>
      <Button title='add' onPress={() => {
        setShowDialog(true);
      }}></Button>
      <View style={{display: 'flex',maxHeight: 50, flexDirection: 'row'}}>
        {renderStartDatePicker()}
        {renderEndDatePicker()}
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
  //  justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'stretch',
  },
});