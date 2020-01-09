import Dialog from "react-native-dialog";
import { StyleSheet, Text, View, Button, AsyncStorage, TextInput, CheckBox, Picker } from 'react-native';
import React from 'react';
import MemoItem from '../MemoItem';
import DatePicker from 'react-native-datepicker';


export default class MemoDialog extends React.Component {
  
  constructor(props) {
    super(props);
    console.log('DIALOG')
    this.cancel=this.cancel.bind(this);
    this.accept=this.accept.bind(this);
    this.renderDatePicker=this.renderDatePicker.bind(this);
    //this.acceptEdit=this.acceptEdit.bind(this);
    //this.onChangeColor=this.onChangeColor.bind(this);
    //const editableNote = this.props.editableNote;
    // if(editableNote) {
    //   this.state={ 
    //     visible: this.props.visible,
    //     title: editableNote.title,
    //     content: editableNote.content,
    //     noteColor: editableNote.style.backgroundColor,
    //     editableNote: editableNote,
    //   }
    // } else {
       this.state={
         visible: this.props.visible,
         title: '',
         content: '',
         allDay: false,
         date: new Date(),
         setAlarm: false,
         alarmValue: 'mins',
         alarmOffset: '10',
    //     noteColor: '#fff'
       }
    // }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.visible !== this.props.visible) {
      this.setState({visible: this.props.visible})
    }
  }

  cancel() {
    this.props.handleClose();
  }

  accept() {
    alarm = [];
    if(this.state.title != '') {
      if(this.state.setAlarm) {
        offset = 0;
        if(this.state.alarmValue == 'mins') {
          offset = this.state.alarmOffset*-1;
        } else if(this.state.alarmValue == 'hours') {
          offset = this.state.alarmOffset*60*-1;
        }else {
          offset = this.state.alarmOffset*1440*-1;
        }
        alarm = [ { 
          method: 'alert',
          relativeOffset: offset 
        } ]
      }
      memo = new MemoItem(this.state.title,
        this.state.content,
        this.state.date,
        alarm, this.state.allDay,
        this.state.offset,
        this.state.alarmValue);
      this.props.saveData(memo);
      this.props.handleClose();
      /*
      title: 'Event',
      startDate: new Date(),
      endDate: new Date(),
      accessLevel: 'default',
      notes: 'some notes',
      alarms: [ { relativeOffset: -15 } ],
      allDay: false,
      */
    }
  }

  // acceptEdit() {
  //   if(this.state.title != '') {
  //     note = new NoteItem(this.state.title, this.state.content, this.state.noteColor);
  //     this.props.editData(note);
  //     this.props.handleClose();
  //   }
  // }

  onChangeTitle(e) {
    this.setState({title: e});
  }

  onChangeContent(e) {
    this.setState({content: e});
  }

  renderDatePicker() {
    return(
      <DatePicker
        style={{width: 200}}
        date={this.state.date}
        mode={this.state.allDay ? 'date' : 'datetime'}
        locale='fi'
     //   format="DD-MM-YYYY"
        confirmBtnText='Confirm'
        cancelBtnText='Cancel'
      //  getDateStr={date => console.log(date)}
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
          var _date = new Date(new Date(date.replace(' ', 'T')));
          _date.setMinutes( _date.getMinutes() + _date.getTimezoneOffset());
          this.setState({date: _date});
        }}
      />
    )
  }

  // onChangeColor(color) {
  //   this.setState({noteColor: color});
  // }

  render() {
    return (
        <View>
          <Dialog.Container visible={this.state.visible}>
            <Dialog.Title>Memo</Dialog.Title>
            <Dialog.Description>
              Add memo
            </Dialog.Description>
            <TextInput 
              style={styles.titleInput} 
              onChangeText={(e) => {
                this.onChangeTitle(e);
              }} 
              value={this.state.title}
              placeholder="Title">
            </TextInput>
            <TextInput 
              multiline={true}
              style={styles.contentInput} 
              onChangeText={(e) => {
                this.onChangeContent(e);
              }} 
              value={this.state.content}
              placeholder="Additional content">
            </TextInput>
            <View style={{flexDirection: 'row'}}>
              <Text>All day</Text>
              <CheckBox value={this.state.allDay} onValueChange={() => {
                this.setState({allDay: !this.state.allDay});
              }}/>
            </View>
            {this.renderDatePicker()}
            <Text>Alarms</Text>
            <CheckBox value={this.state.setAlarm} onValueChange={() => {
              this.setState({setAlarm: !this.state.setAlarm});
            }}/>
            <View style={{flexDirection: 'row'}}>
              <TextInput keyboardType={'numeric'}
                value={this.state.alarmOffset}
                onChangeText={text => this.setState({alarmOffset: text})}
                style={{borderColor:'black', borderBottomWidth:1}}
              />
              <Picker
                selectedValue={this.state.alarmValue}
                style={{height: 50, width: 120}}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({alarmValue: itemValue})
                }>
                <Picker.Item label='mins' value='mins' />
                <Picker.Item label='hours' value='hours' />
                <Picker.Item label='days' value='days' />
              </Picker>
              <Text>before</Text>
            </View>
            <Dialog.Button onPress={this.cancel} label="Cancel" />
            <Dialog.Button onPress={this.accept} label="Accept" />
          </Dialog.Container>
        </View>
      )
  }

}

const styles = StyleSheet.create({
  titleInput: {
    borderColor: 'gray',
    borderWidth: 2,
    paddingLeft: 4,
    minHeight: 40,
    marginBottom: 4,
  },
  contentInput: {
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingLeft: 4,
    minHeight: 40,
    marginBottom: 4, 
  },
});