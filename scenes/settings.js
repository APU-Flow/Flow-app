// settings.js
// Flow
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Text, Alert, ScrollView, View, TouchableHighlight, AsyncStorage } from 'react-native';


export default class Settings extends Component {

  static get propTypes() {
    return {
      logout: React.PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      meterList: ['Meter 1', 'Meter 2', 'Meter 3']
    };
    this.confirmDeleteHistory = this.confirmDeleteHistory.bind(this);
  }


  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <TouchableHighlight style={styles.button} onPress={this.props.logout}>
          <View style={styles.dropdown}>
            <Text style={styles.buttonText}>Logout</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button} onPress={this.confirmDeleteHistory}>
          <View style={styles.dropdown}>
            <Text style={styles.buttonText}>Delete Data History</Text>
          </View>
        </TouchableHighlight>

      </ScrollView>
    );
  }

  confirmDeleteHistory() {
    Alert.alert(
      'Delete Data History',
      'Are you sure you want to delete your data history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => {
          AsyncStorage.getItem('token', (err, token) => {
            if (err) {
              Alert.alert('Error', 'User login token missing!');
              return;
            }
            fetch('http://138.68.56.236:3000/api/deleteUserData', {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': token
              }
            })
              .then((response) => {
                switch (response.status) {
                  case 200:
                    response.json().then((responseObject) => {
                      Alert.alert('Successful');
                    });
                    break;
                  default:
                    response.json().then((responseObject) => Alert.alert('Failure', responseObject.message));
                }
              }); // End fetch() callbacks
          }); // End AsyncStorage getItem
        }} // End 'Yes' button function
      ],
      { cancelable: false }
    ); // End confirmation alert
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(52,152,219)',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    marginTop: 25,
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 15
  },
  button: {
    margin: 8,
    backgroundColor: 'rgb(31,58,147)',
    height: 45,
    justifyContent: 'center',
    marginTop: 15
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 18
  },
  dropdown: {
    margin: 8,
    borderColor: 'rgb(31,58,147)',
    backgroundColor: 'rgb(31,58,147)',
    borderWidth: 1,
    borderRadius: 1,
  },
});
