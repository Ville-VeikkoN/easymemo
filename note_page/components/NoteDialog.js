import Dialog from "react-native-dialog";
import { StyleSheet, Text, View, Button, AsyncStorage, TextInput } from 'react-native';
import React from 'react';
import NoteItem from '../NoteItem'
import ColorPicker from '../components/ColorPicker'

export default class NoteDialog extends React.Component {
  
  constructor(props) {
    super(props);
    this.cancel=this.cancel.bind(this);
    this.accept=this.accept.bind(this);
    this.acceptEdit=this.acceptEdit.bind(this);
    this.onChangeColor=this.onChangeColor.bind(this);
    const editableNote = this.props.editableNote;
    if(editableNote) {
      this.state={ 
        visible: this.props.visible,
        title: editableNote.title,
        content: editableNote.content,
        noteColor: editableNote.style.backgroundColor,
        editableNote: editableNote,
      }
    } else {
      this.state={
        visible: this.props.visible,
        title: '',
        content: '',
        noteColor: '#fff'
      }
    }
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
    if(this.state.title != '') {
      note = new NoteItem(this.state.title, this.state.content, this.state.noteColor);
      this.props.saveData(note);
      this.props.handleClose();
    }
  }

  acceptEdit() {
    if(this.state.title != '') {
      note = new NoteItem(this.state.title, this.state.content, this.state.noteColor);
      this.props.editData(this.state.editableNote.title, note);
      this.props.handleClose();
    }
  }

  onChangeTitle(e) {
    this.setState({title: e});
  }

  onChangeContent(e) {
    this.setState({content: e});
  }

  onChangeColor(color) {
    this.setState({noteColor: color});
  }

  render() {
    if(this.state.editableNote) {
      return (
        <View>
          <Dialog.Container visible={this.state.visible}>
            <Dialog.Title>Note</Dialog.Title>
            <Dialog.Description>
              Edit note
            </Dialog.Description>
            <TextInput 
              style={styles.titleInput} 
              editable={false}
              onChangeText={(e) => {
                this.onChangeTitle(e);
                console.log(this.state.title)
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
            <ColorPicker noteColor={this.state.noteColor} onChangeColor={this.onChangeColor}></ColorPicker>
            <Dialog.Button onPress={this.cancel} label="Cancel" />
            <Dialog.Button onPress={this.acceptEdit} label="Accept" />
          </Dialog.Container>
        </View>
      )
    } else {
      return (
        <View>
          <Dialog.Container visible={this.state.visible}>
            <Dialog.Title>Note</Dialog.Title>
            <Dialog.Description>
              Add note
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
            <ColorPicker noteColor={this.state.noteColor} onChangeColor={this.onChangeColor}></ColorPicker>
            <Dialog.Button onPress={this.cancel} label="Cancel" />
            <Dialog.Button onPress={this.accept} label="Accept" />
          </Dialog.Container>
        </View>
      )
    }

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