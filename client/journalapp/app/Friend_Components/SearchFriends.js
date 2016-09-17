import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  Navigator,
  ListView,
  Dimensions
} from 'react-native';

import SearchResultsList from './SearchResultsList';
import styles from '../styles/SearchFriendsStyles';

export default class SearchFriends extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      text: '',
      results: [],
      iconStyle: {}
    }

  };

  // This method fires whenever a user enters input in the input text in this component
  // (see the jsx template below).
  findMatching(query) {
    var url = 'http://journal-app-mundane-unicorns.herokuapp.com/api/users' + "/?username=" + query;
    AsyncStorage.getItem('@MySuperStore:token', (err, token) => {
      fetch(url , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      })
      .then( resp => { resp.json()
        .then( json => {
          const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({
            text: query,
            results: json
          })
        })
        .catch((error) => {
          console.log("fetch error on getrequest:", error)
        });
      });
    });
  };

  // Sending the friend request occurs when the user clicks the friend icon in the SearchResultRow view. 
  sendFriendReq(id, navigator) {
     AsyncStorage.getItem('@MySuperStore:token', (err, token) => {
       var message = {requestReceiver:id};
       fetch('http://journal-app-mundane-unicorns.herokuapp.com/api/friendreq', {
         method: 'POST',
         headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
         },
         body: JSON.stringify(message)
       })
         .then((response) => {
            // Uncomment this pop if you want the screen to pan back to the friends list after a request is sent. 
            // Set a timer around it to make the transition delayed.
            //navigator.pop();
         })
           .catch((error) => {
             console.log("fetch error:", error)
           });
     });
  }

  // TODO (?) Use lodash throttling (a la recastly sprint) to prevent blowing up the server
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textinput}
          placeholder= 'Search for your friend by username'
          onChangeText={(text) => this.findMatching(text)} />
        <SearchResultsList 
          results={this.state.results} 
          sendreq={this.sendFriendReq.bind(this)}
          navigator={this.props.navigator}/>
      </View>
    )
  }
}
