import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

import styles from '../styles/ChangePasswordSceneStyles';

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      oldPW: '',
      newPW: '',
      successful: false
    }
  }

  updateOldPW(val) {
    this.setState({
      oldPW: val
    })
  }

  updateNewPW(val) {
    this.setState({
      newPW: val
    })
  }

  showMessage() {
    if (this.state.successful) {
      return (
        <Text style={ styles.message }>Password successfully changed</Text>
      )
    }
  }

  checkOldPW() {
    AsyncStorage.getItem('@MySuperStore:username', (err, username) => {
      /* check if the password matches */
      var user = JSON.stringify({
        username: username,
        password: this.state.oldPW
      });
      fetch('http://journal-app-mundane-unicorns.herokuapp.com/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: user
      }).then(response => {
        if (response.status === 200) {
          this.updatePW(username, this.state.newPW);
        } else {
          console.log('Error: ', response.json());
        }
      }).catch(err => {
        console.log('Error: ', err);
      })
    })
  }

  updatePW(username, newPassword) {
    AsyncStorage.getItem('@MySuperStore:token', (err, token) => {
      var user = JSON.stringify({
        username: username,
        password: newPassword
      });
      fetch('http://journal-app-mundane-unicorns.herokuapp.com/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: user
      }).then(response => {
        console.log('Password updated: ', response);
        if (response.status === 204) {
          this.setState({ successful: true });
        } else {
          this.setState({ successful: false });
        }
      }).catch(err => {
        console.log('Failed updating: ', err);
      })
    })
  }

  render() {
    return (
      <View style={ styles.container }>
        <Text style={ styles.label }>Old password: </Text>
        <TextInput 
          type='TextInput'
          secureTextEntry={ true } 
          onChangeText={ (text) => this.updateOldPW(text) } 
          style={ styles.textinput }></TextInput>
        <Text style={ styles.label }>New password: </Text>
        <TextInput 
          type='TextInput'
          secureTextEntry={ true }
          onChangeText={ (text) => this.updateNewPW(text) }
          style={ styles.textinput }></TextInput>
        <TouchableHighlight 
          onPress={ () => this.checkOldPW() } 
          underlayColor='#218c23' 
          style={ styles.button }>
          <Text style={ styles.submit }>Submit</Text>
        </TouchableHighlight>
        { this.showMessage() }
      </View>
    )
  }
}