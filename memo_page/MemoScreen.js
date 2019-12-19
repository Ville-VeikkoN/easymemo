import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import * as Calendar from 'expo-calendar';

export default function MemoScreen() {

  useEffect(() => {
    try{
      AsyncStorage.getItem('calendarID')
        .then(res => {
          if(res == null) {
            createCalendar();
          }
        })
    } catch(e) {
      console.log(e);
    }
    Calendar.requestPermissionsAsync()
      .then(res => {
        console.log(res)
        if(res.granted) {
          Calendar.getCalendarsAsync()
            .then(res => console.log(res));
        }
      })
  },[])

  async function deleteCalendar() {
    Calendar.deleteCalendarAsync(4);
    Calendar.deleteCalendarAsync(5);
    Calendar.deleteCalendarAsync(6);

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
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <Text>Memos coming soon</Text>
  );
}
