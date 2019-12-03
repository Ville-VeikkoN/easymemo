import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class MemoScreene extends React.Component {

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Memos',
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() => navigate('Profile', {name: 'Jane'})}
      />
    );
  }

}
