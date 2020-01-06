import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import DatePicker from 'react-native-datepicker'

export default function MemoScreen() {

  const [calendarId, setCalendarId] = React.useState('');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  useEffect(() => {

    // Calendar.getCalendarsAsync()
    //   .then(res => console.log(res))

    try{

      Calendar.requestPermissionsAsync()
      .then(res => {
        if(res.granted) {
          AsyncStorage.getItem('calendarID')
          .then(res => {
            console.log(typeof res)
            if(res == null) {
              createCalendar();
            } else {
              setCalendarId(res);
            }
          })
        }
      })



    } catch(e) {
      console.log(e);
    }

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

  async function getEvents() {
    events = await Calendar.getEventsAsync([calendarId], startDate, endDate)
    console.log(events)   
  }

  function addEvent() {
    console.log(calendarId)

    details = (
      {
        'title': 'Event',
        'startDate': startDate,
        'endDate': endDate,
      }
    )
    Calendar.createEventAsync(calendarId, {
      title: 'my new event',
      startDate: new Date(),
      endDate: new Date(),
      accessLevel: 'default',
      notes: 'some notes',
      alarms: [ { relativeOffset: -15 } ],
    })
  }

  function renderStartDatePicker() {
    return(
      <DatePicker
        style={{width: 200}}
        date={startDate}
        mode="date"
        format="DD-MM-YYYY"
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
        onDateChange={(date) => {setStartDate(date)}}
      />
    )
  }

  function renderEndDatePicker() {
    return(
      <DatePicker
        style={{width: 200}}
        date={endDate}
        mode="date"
        format="DD-MM-YYYY"
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
          getEvents();
        }}
      />
    )
  }

  return (
    <View style={{display:'flex'}}>
      <Button title='press' onPress={() => console.log(calendarId)}></Button>
      <Button title='add' onPress={() => {
        console.log('add calendar Event')
        addEvent();
      }}></Button>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        {renderStartDatePicker()}
        {renderEndDatePicker()}
      </View>
    </View>
  );
}
