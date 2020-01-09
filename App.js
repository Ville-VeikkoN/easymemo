import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import React from 'react'
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';
import NoteScreen from './note_page/screens/NoteScreen'
import MemoScreen from './memo_page/screens/MemoScreen'

const NoteNavigation = createStackNavigator({
  screen: { screen: NoteScreen },
});

const MemoNavigation = createStackNavigator({
  screen: MemoScreen,
})



const TabNavigator = createBottomTabNavigator({
  Note: NoteNavigation,
  Memo: MemoNavigation
},
{
  defaultNavigationOptions: ({navigation}) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const routeName = navigation.state.routeName
      if(routeName == 'Note') {
        return <Ionicons name="md-clipboard" size={20} />;
      } else {
        return <Ionicons name="md-calendar" size={20} />;
      }
    }
  })
}
);

const App = createAppContainer(TabNavigator);

export default App; 