import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  Linking,
  ScrollView,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from 'react-native-google-signin';
import axios from 'axios';
import API from '../constants/api';
import Button from './button';
import FBIcon from '../components/FBIcon';
import GoogleIcon from '../components/GoogleIcon';

const hdpi = PixelRatio.get() < 2 ? true : false ;

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: __DEV__ ? Math.random().toString(36) : '',
      email: __DEV__ ? Math.random().toString(36) + '@yopmail.com' : '',
      avatarURL: '',
      socialLogin: false,
      password: __DEV__ ? '12345678' : '',
      confirmPassword: __DEV__ ? '12345678' : '',
      errorMsg: '',
    };
  }

  onRegister = () => {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        errorMsg: 'Confirm password did not match.',
      });
    } else {
      this.setState({
        errorMsg: '',
      });

      const http = axios.create({
        baseURL: API.baseURL,
        timeout: 10000,
        headers: {
          Accept: API.acceptHeader,
          'Content-Type': API.contentType,
        },
      });
      const params = {
        method: 'POST',
        url: API.account.register,
        responseType: 'json',
        data: {
          name: this.state.fullName,
          username: this.state.email,
          email: this.state.email,
          password: this.state.password,
          avatar: this.state.avatarURL,
          idfa: this.props.idfa,
        },
      };
  
      // console.log(params);
      http
        .request(params)
        .then(response => {
          console.log('response: ', response);
          this.props.onToggleLogin(response.data.response);
        })
        .catch(error => {
          console.log('error: ', error.response);
          if (typeof error.response.data.error_message === 'string') {
            this.setState({
              errorMsg: error.response.data.error_message,
            });
          } else {
            const msgs = Object.keys(error.response.data);
            const arr = [];
            msgs.forEach(msg => {
              console.log(error.response.data[msg][0]);
              if (error.response.data[msg][0] === 'validation.required') {
                arr.push('Please enter your ' + msg);
              } else if (error.response.data[msg][0] === 'validation.email') {
                arr.push('Please enter a valid email address');
              } else if (error.response.data[msg][0] === 'validation.min.string') {
                arr.push('Password must contains 8 characters');
              } else {
                arr.push('- ' + msg + ': ' + error.response.data[msg][0]);
              }
            });
            const newArr = arr.join('\n');
            this.setState({
              errorMsg: newArr,
            });
          }
        });
  
      Keyboard.dismiss();

    }
  };

  onRegisterGoogle = async () => {
    console.log('register google');
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.configure({
        iosClientId:
          '722495536620-5avb6deim17p2pndfbehe20bhtm3j9vb.apps.googleusercontent.com',
        webClientId:
          '722495536620-k9746i1gl71n4raotdinhv9gp27b5usr.apps.googleusercontent.com',
        offlineAccess: false,
      });

      const response = await GoogleSignin.signIn();
      const { accessToken } = response;
      if (accessToken) {
        const response = await axios.get(API.googleURL, {
          headers: { Authorization: 'Bearer ' + accessToken },
        });
        // const payload = {
        //   token: accessToken,
        //   provider: 'google',
        // };
        if (response) {
          const params = {
            fullName: response.data.name,
            email: response.data.email,
            avatarURL: response.data.picture,
            socialLogin: true,
          };
          this.setState(params);
          try {
            await GoogleSignin.signOut();
          } catch (e) {
            return { error: e };
          }
        } else {
          alert('Google login failed');
        }
      }
    } catch (err) {
      /* EMPTY */
    }
  };

  onRegisterFacebook = async () => {
    try {
      let response = {
        type: 'failed',
        token: '',
      };

      const result = await LoginManager.logInWithReadPermissions([
        'public_profile',
        'email',
      ]).then(resp => {
        return resp;
      });

      if (!result.isCancelled) {
        const accessToken = await AccessToken.getCurrentAccessToken().then(
          data => data.accessToken,
        );
        if (accessToken) {
          const response = await axios.get(
            API.facebookURL +
              '?fields=id,name,email,picture.type(large)&access_token=' +
              accessToken,
          );
          if (response) {
            const params = {
              fullName: response.data.name,
              email: response.data.email,
              avatarURL: response.data.picture.data.url,
              socialLogin: true,
            };
            this.setState(params);
          } else {
            alert('Facebook login failed');
          }
        }
      }

      // const { type, token } = response;
      // if (type === 'success') {
      //   const payload = {
      //     token,
      //     provider: 'facebook',
      //   };
      //   return payload;
      // }
      return { error: 'User Cancelled' };
    } catch (e) {
      return { error: e };
    }
  };

  onTncPress = () => {
    const isUrl = Linking.canOpenURL('http://unifi.com.my/wifi/tnc');
    if (isUrl) {
      return Linking.openURL('http://unifi.com.my/wifi/tnc');
    }
  };

  changeFullName = fullName => {
    return this.setState({ fullName });
  };

  changeEmail = email => {
    return this.setState({ email });
  };

  changePassword = password => {
    return this.setState({ password });
  };

  changeConfirmPassword = confirmPassword => {
    return this.setState({ confirmPassword });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.errorMsg ? (
          <View style={styles.errorMsg}>
            <Text style={styles.errorMsgText}>{this.state.errorMsg}</Text>
          </View>
        ) : null}
        <ScrollView>
        {this.state.avatarURL !== '' ? (
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: 'grey',
                fontWeight: 'normal',
              }}
            >
              Hey {this.state.fullName}!
            </Text>
            <View style={styles.avatarBound}>
              <Image
                style={styles.avatar}
                source={{ uri: this.state.avatarURL }}
              />
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.socialTitle}>Sign Up with</Text>
            <View style={styles.socialBtns}>
              <TouchableOpacity
                onPress={this.onRegisterFacebook}
                style={[styles.socialButton, { backgroundColor: '#3B5998' }]}
              >
                <FBIcon color="white" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.onRegisterGoogle}
                style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
              >
                <GoogleIcon color="white" size={30} />
              </TouchableOpacity>
              {/* <Button type='facebook' style={styles.facebookBtn} onPress={this.onRegisterFacebook} title="Register with Facebook" />
              <Button type='google' style={styles.googleBtn} onPress={this.onRegisterGoogle} title="Register with Google" /> */}
            </View>
            <Text style={styles.pageTitle}>...or create new account?</Text>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={this.state.fullName}
          onChangeText={this.changeFullName}
          underlineColorAndroid="rgba(0,0,0,0)"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={this.state.email}
          onChangeText={this.changeEmail}
          underlineColorAndroid="rgba(0,0,0,0)"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={this.changePassword}
          secureTextEntry={true}
          value={this.state.password}
          underlineColorAndroid="rgba(0,0,0,0)"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={this.changeConfirmPassword}
          value={this.state.confirmPassword}
          secureTextEntry={true}
          underlineColorAndroid="rgba(0,0,0,0)"
        />
        
        <View style={styles.footer}>
          <TouchableOpacity onPress={this.props.onToggleLogin}>
            <Text style={styles.toggleLoginText}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tnc}>
          <Text style={{ fontSize: 10 }}>By continuing. I agree with the </Text>
          <TouchableOpacity onPress={this.onTncPress}>
            <Text style={{ textDecorationLine: 'underline', fontSize: 10 }}>
              terms & conditions
            </Text>
          </TouchableOpacity>
        </View>
        <Button
          style={styles.registerBtn}
          onPress={this.onRegister}
          title="Register"
        />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: hdpi ? 25 : 43,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarBound: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  socialBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorMsg: {
    backgroundColor: '#fee',
    padding: hdpi ? 8 : 10,
    marginBottom: hdpi ? 8 : 20,
    borderRadius: 3,
  },
  errorMsgText: {
    color: 'red',
    fontSize: hdpi ? 12 : 14,
  },
  socialTitle: {
    fontSize: hdpi ? 13 : 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: hdpi ? 13 : 16,
    fontWeight: 'bold',
    marginTop: hdpi ? 10 : 15,
  },
  footer: {
    width: '100%',
    paddingVertical: hdpi ? 5 : 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  tnc: {
    width: '100%',
    paddingTop: hdpi ? 5 : 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  toggleLoginText: {
    textDecorationLine: 'underline',
    fontSize: hdpi ? 12 : 14,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: hdpi ? 2 : 6,
    paddingHorizontal: 10,
    marginTop: hdpi ? 6 : 8,
    borderRadius: 3,
  },
  registerBtn: {
    marginTop: 10,
  },
  socialButton: {
    marginTop: hdpi ? 10 : 20,
    width: '48%',
    paddingVertical: hdpi ? 5 : 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});
