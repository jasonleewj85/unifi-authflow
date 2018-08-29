import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FBIcon from "./FBIcon";
import GoogleIcon from "./GoogleIcon";

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      this.props.type === 'facebook' ?
        <TouchableOpacity style={[styles.btnStyle, this.props.style, styles.facebookBtn]} onPress={this.props.onPress}>
        {/* <FBIcon color="white" size={30} /> */}
          <Text style={[styles.textStyle, this.props.textStyle, styles.facebookText]}>{this.props.title}</Text>
        </TouchableOpacity>
        : (
          this.props.type === 'google' ?
            <TouchableOpacity style={[styles.btnStyle, this.props.style, styles.googleBtn]} onPress={this.props.onPress}>
            {/* <GoogleIcon color="white" size={30} /> */}
              <Text style={[styles.textStyle, this.props.textStyle, styles.googleText]}>{this.props.title}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={[styles.btnStyle, this.props.style]} onPress={this.props.onPress}>
              <Text style={[styles.textStyle, this.props.textStyle]}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    );
  }
}

const styles = StyleSheet.create({
  btnStyle: {
    borderRadius: 5,
    backgroundColor: '#EF5B2F',
    padding: 13,
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  facebookBtn: {
    backgroundColor: '#2E57A3',
    // padding: 0,
  },
  googleBtn: {
    backgroundColor: '#D73E3B',
    // padding: 0,
  },
  facebookText: {
    // fontSize: 36,
    // fontWeight: 'bold',
  },
  googleText: {
    // fontSize: 36,
    // fontWeight: 'bold',
  },
});