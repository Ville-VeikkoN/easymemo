import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import * as Calendar from 'expo-calendar';
import DatePicker from 'react-native-datepicker'

export default function MemoScreen() {

  const [calendarId, setCalendarId] = React.useState('');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  useEffect(() => {
    try{
      AsyncStorage.getItem('calendarID')
        .then(res => {
          if(res == null) {
            createCalendar();
          }
          setCalendarId(res);
        })
        .then(() => {
          Calendar.requestPermissionsAsync()
          .then(res => {
            if(res.granted) {
              Calendar.getCalendarsAsync()
                .then(res => {
                  console.log(res)
                  // for(cal of res) {
                  //   if(cal.title == 'My Calendar') {
                  //     Calendar.deleteCalendarAsync(cal.id);
                  //     console.log('deleted');
                  //   }
                  // }
                });
            }
          })
        })
        .then(() => {

        })
    } catch(e) {
      console.log(e);
    }

  },[])

  async function getCalendarEvents() {
  }

  async function createCalendar() {
    details = (
      {
        "allowsModications": true,
        "color": "yellow",
        "entityType": "event",
        "source": {
          "id": "220e5c20-eee3-406a-b1e0-cbd59b06ce66",
          "name": "event_calendar",
          "type": "local",
        },
        "sourceId": "220e5c20-eee3-406a-b1e0-cbd59b06ce66",
        "title": "My Calendar",
        "type": "local",
        "name": "event_calendar",
        "accessLevel": Calendar.CalendarAccessLevel.OWNER,
        "ownerAccount": "local",
        "isLocalAccount": true,
      }
    )
    try {
      let calendarID = await Calendar.createCalendarAsync(details);
      AsyncStorage.setItem('calendarID', calendarID);
      setCalendarId(calendarID);
    } catch(error) {
      console.log(error);
    }
  }

  function getEvents() {
    Calendar.getEventsAsync([calendarId], startDate, endDate)
      .then(res => console.log(res))
  }

  function addEvent() {
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
      accessLevel: "default",
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
