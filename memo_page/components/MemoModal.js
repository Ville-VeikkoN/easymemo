import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Button, Image } from 'react-native';
import { Card, CheckBox } from 'react-native-elements';
import Modal from 'react-native-modal';
import moment from 'moment';

export default class MemoModal extends React.Component {

  constructor(props) {
    super(props);
  }

  getParsedAlarm() {
    alarm = this.props.memo.alarms[0];
    offset = alarm.relativeOffset * -1;
    stringToReturn = '';
    console.log(offset % 1440 === 0);
    if(offset % 1440 === 0) {
      stringToReturn = 'alarm '+offset/1440+' days before';
    } else if(offset % 60 === 0) {
      stringToReturn = 'alarm '+offset/60+' hours before';
    } else {
      stringToReturn = 'alarm '+offset+' mins before';
    }
    return <Text>{stringToReturn}</Text>;
  }

  render() {
    const memo = this.props.memo;
    return (
      <View style={styles.container}>
        <Modal
          isVisible={true}
          animationIn='fadeIn'
          animationOut='fadeOut'
          hideModalContentWhileAnimating={true}
          backdropTransitionOutTiming={0}
          onBackdropPress={() => this.props.handleClose()}>
          <Card title={memo.title} containerStyle={{backgroundColor: '#5edfff'}}>
            <View style={styles.modalcontent}>
              <Text style={{fontSize:20}}>{moment(new Date(memo.startDate)).format('YYYY-MM-DD')}</Text>
              <Text style={{fontSize:20}}>{memo.notes}</Text>
              {console.log(memo.alarms, ' ALARMS')}
              {memo.alarms.length !== 0 ? this.getParsedAlarm() : <Text>No alarms</Text>}
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



