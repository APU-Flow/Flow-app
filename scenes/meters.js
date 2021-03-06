// meters.js
// Flow
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Text, Alert, View, TouchableHighlight, ListView, AsyncStorage } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalDropdown from 'react-native-modal-dropdown';

export default class Meters extends Component {

  static get propTypes() {
    return {
      pushRoute: React.PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['Kitchen Sink', 'Upstairs Shower', 'Downstairs Bathroom Sink', 'Upstairs Bathroom Sink']),
      meterList: [],
      submitReport: '',
    };

    this.dropdownRenderRow = this.dropdownRenderRow.bind(this);
    this.addMeter = this.addMeter.bind(this);
    this.dropMeter = this.dropMeter.bind(this);
    this.viewMeter = this.viewMeter.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem('token', (errors, token) => {
      if (errors) {
        Alert.alert('Error', errors.toString());
      }

      fetch('http://138.68.56.236:3000/api/getMeterIdList', {
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
              let {meterIds} = responseObject;

              if (!Array.isArray(meterIds)) {
                this.setState({
                  submitReport: 'Failed to retrieve meter ID list - server returned invalid response!',
                  meterList: []
                });
                return;
              }

              let meterList = [];
              for (let i = 0; i < meterIds.length; i++) {
                meterList[i] = meterIds[i].meterId;
              }

              this.setState({submitReport: '', meterList});
            });
            break;
          case 204:
            this.setState({
              submitReport: 'No meters found for this user!',
              meterList: []
            });
            break;
          default:
            response.json().then((responseObject) => {
              this.setState({
                submitReport: `${response.status}: ${responseObject.message}`,
                meterList: []
              });
            });
        }
      });
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <Text style={styles.title}>Meters</Text>
        <ModalDropdown style={styles.dropdown}
          options={this.state.meterList}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownDropdown}
          defaultValue='Device Overview'
          renderRow={this.dropdownRenderRow}
          disabled={this.state.meterList.length === 0}
          onSelect={this.viewMeter}
        />
        <ModalDropdown style={styles.dropdown}
          options={this.state.meterList}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownDropdown}
          defaultValue='Drop A Meter'
          renderRow={this.dropdownRenderRow}
          disabled={this.state.meterList.length === 0}
          onSelect={this.dropMeter}
        />
        <TouchableHighlight style={styles.button} onPress={this.addMeter}>
          <Text style={styles.buttonText}>Add a Meter</Text>
        </TouchableHighlight>
        <Text>{this.state.submitReport}</Text>
      </KeyboardAwareScrollView>
    );
  }

  dropdownRenderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
    return (
      <TouchableHighlight underlayColor='cornflowerblue'>
       <View style={[styles.dropdownRow, {backgroundColor: evenRow ? 'rgb(31,58,147)' : 'rgb(31,58,147)'}]}>
          <Text style={[styles.dropdownRowText, highlighted && {color: 'white'}]}>
             {`Meter ${rowData}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  viewMeter(index, value) {
    this.props.pushRoute({
      name: 'graphs',
      passProps: {meterId: value}
    });
    return false; //this turns the selected option back to the original
  }

  addMeter() {
    this.props.pushRoute({name: 'addMeter'});
  }

  dropMeter(index, value) {
    Alert.alert(
      `${value}`,
      'Are you sure you want to drop this meter?',
      [
        {text: 'Cancel', onPress: () => Alert.alert('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => Alert.alert('Drop Meter', `${value} was dropped.`)},
      ],
      { cancelable: false }
    );
    return false; //this turns the selected option back to the original
  }

}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor:'rgb(52,152,219)',
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
    borderColor:  'rgb(31,58,147)',
    backgroundColor: 'rgb(31,58,147)',
    borderWidth: 1,
    borderRadius: 1,
  },
  dropdownText: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdownDropdown: {
    margin: 8,
    width: 320,
    height: 44,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 3,
    backgroundColor: 'rgb(31,58,147)',
  },
  dropdownRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    backgroundColor: 'rgb(31,58,147)'
  },
  dropdownRowText: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',
  }
});
