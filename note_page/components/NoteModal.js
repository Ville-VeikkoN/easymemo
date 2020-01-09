import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Button, Image } from 'react-native';
import { Card, CheckBox } from 'react-native-elements';
import Modal from 'react-native-modal';
import moment from 'moment';
import ColorPicker from './ColorPicker';

export default class NoteModal extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const note = this.props.note;
    return (
      <View style={styles.container}>
        <Modal
          isVisible={true}
          animationIn='fadeIn'
          animationOut='fadeOut'
          hideModalContentWhileAnimating={true}
          backdropTransitionOutTiming={0}
          onBackdropPress={() => this.props.handleClose()}>
          <Card title={moment(new Date(note.date)).format('DD.MM.YYYY')} containerStyle={{backgroundColor: note.style.backgroundColor}}>
            <View style={styles.modalcontent}>
              <Text style={{fontSize:20, marginBottom:10}}>{note.title}</Text>
              <Text style={{fontSize:18, marginBottom:10}}>{note.content}</Text>
              <TouchableOpacity onPress={() => this.props.handleClose()}>
                <Text style={{fontSize:18, color:'blue'}}>close</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  modalcontent: {
    alignItems: 'center',
  }
});



