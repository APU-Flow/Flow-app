// splash.js
// Flow

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Splash extends Component{
  render() {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          FLOW
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor:'rgb(52, 152, 219)',
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  title: {
    color:'white',
    fontSize:45,
    fontWeight:'bold',
    paddingBottom:40
  }
});