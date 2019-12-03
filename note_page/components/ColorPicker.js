import { StyleSheet, Text, View, Button, AsyncStorage, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import NoteItem from '../NoteItem'

export default class ColorPicker extends React.Component {
  
  constructor(props) {
    super(props);
  }

  colorOptions= [
    color1= this.props.noteColor,
    color2= '#ff7eb9',
    color3= '#ff65a3',
    color4= '#7afcff',
    color5= '#feff9c',
    color6= '#fff740',
  ]

  render() {
    return (
    <View style={styles.colorpicker}>
      {this.colorOptions.map((color, index) => {
        return <TouchableOpacity key={index} onPress={() => this.props.onChangeColor(color)}>
          <View style={[{width:40, height:40, backgroundColor:color}, this.props.noteColor==color ? styles.selected : styles.notselected]}></View>
        </TouchableOpacity>
      })}
    </View>

    )
  }

}

const styles = StyleSheet.create({
  colorpicker: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center'
  },
  selected: {
    borderColor: 'black',
    borderWidth: 2
  },
  notselected: {
    borderColor: 'lightgray',
    borderWidth: 1
  }
});