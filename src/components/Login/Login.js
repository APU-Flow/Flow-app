import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LoginForm from './LoginForm';

export default class Login extends Component{
  render (){
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../Images/flow.jpg')}
          />
        </View>
        <LoginForm />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor:'rgb(52,152,219)'
  },
  logo: {
    width:200,
    height:200
  },
  logoContainer: {
    justifyContent:'center',
    alignItems:'center',
    flexGrow:1
  }
  ,
  formContainer:{
    flex:1,
    justifyContent:'space-between',
    alignItems:'center'
  }
});
