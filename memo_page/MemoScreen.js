import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Calendar from 'expo-calendar';

export default function MemoScreen() {

  useEffect(() => {
    Calendar.requestPermissionsAsync()
      .then(res => {
        console.log(res)
        if(res.granted) {
          Calendar.getCalendarsAsync()
            .then(res => console.log(res, 'calendars'));
        }
      })
    // (async () => {
    //   const { status } = await Calendar.requestPermissionsAsync();
    //   if (status === 'granted') {
    //     const calendars = await Calendar.getCalendarsAsync();
    //     console.log({ calendars });
    //   }
    // })();
  },[])

  return (
    <Text>Memos coming soon</Text>
  );
}
