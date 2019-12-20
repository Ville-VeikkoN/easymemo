import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import * as Calendar from 'expo-calendar';

export default function MemoScreen() {

  const [calendarId, setCalendarId] = React.useState('null');

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
                // .then(res => console.log(res));
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

  return (
    <View>
      <Button title='press' onPress={() => console.log(calendarId)}></Button>
    </View>
  );
}
