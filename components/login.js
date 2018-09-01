import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  NetInfo,
} from 'react-native';
import Button from './button';
import axios from 'axios';
import API from '../constants/api';

const hdpi = PixelRatio.get() < 2 ? true : false;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.defaultUsername,
      password: __DEV__ ? '12345678' : '',
    };
  }

  changeUsername = username => {
    return this.setState({ username });
  };

  changePassword = password => {
    return this.setState({ password });
  };

  onLogin = () => {
    console.log('onLogin');
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
      url: API.auth.token,
      responseType: 'json',
      data: {
        username: this.state.username,
        password: this.state.password,
        client_id: this.props.clientId,
        client_secret: this.props.clientSecret,
        grant_type: 'password',
      },
    };

    NetInfo.getConnectionInfo().then((connectionInfo) => {
      if (connectionInfo.type !== 'none') {
        console.log(params);
        http
          .request(params)
          .then(response => {
            console.log('response: ', response);
            // this.props.onToggleOpen();
            this.props.onLoggedIn(response.data);
            // this.props.onLoggedIn({
            //   token_type: 'Bearer',
            //   expires_in: 86399,
            //   access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc5NTdiMWJmMjVhNGNmYTMwNWU0ZGJmNjE5NTFhOThjZjYwNjNhMjllNDJmMWM3MjFhY2NjZWU1NTdiNjAwYmI1ZGUwNTQ2OTBhMjJjNGJmIn0.eyJhdWQiOiIyIiwianRpIjoiNzk1N2IxYmYyNWE0Y2ZhMzA1ZTRkYmY2MTk1MWE5OGNmNjA2M2EyOWU0MmYxYzcyMWFjY2NlZTU1N2I2MDBiYjVkZTA1NDY5MGEyMmM0YmYiLCJpYXQiOjE1MjkyOTA0MTIsIm5iZiI6MTUyOTI5MDQxMiwiZXhwIjoxNTI5Mzc2ODExLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.jWl-JxrFssipIAwo3nTVIDLN9gUAugMJICFOylzUxtjRBavP578klq998IWjKfR0RJ1sbqeyw3e5fuIdrPhr9R39qVavWKeTEdJUdPMq1aFMWHbJrb4FoqECmfWfMpPjuYzE93piqAopb8j41aiXb_2WXKp-XVEHQX6M-QbCooJP72aj86xVNvAglvrJ3my7FSduY6-1K-qCztzliw8rDUV9P08cO_Xbt1VkW7oEwqa69IoiqwF9E20HjW-Ntnx5rEbimOXyN_tPf-H3VWxZAwchzhyw6wfu7IQdqQM0fWd8n1V3jZk194k9kOgPpr70fyJ-UP5EA0N7AGVRt69JHwgGvV456grL9VFLGfwQIXocp-oshFvFk2nsQqZyE-r4MJ_SLAGPRNpklGRt503w0KuzNph23ZagipPYJSdy6m-GUovjGOVko-RUcB3khyIy8fqieqyyRnnGqxzrv0KLGGze1NeFWpQ_QcBok8GLm-ww3f3D93bYyKVvJikJ51zL5Wq8eAkLRAgORbvsePZ-9Kws8-9VFyxEIZX5pt7O_0-oCrvr79xjG9dAyOyMRjsWe0qo1zn34RxQakhPRtBmAIRjF5EH9YiKOlHt4k8sLhRX98eOwc3Irg3EWxt1q0jxxXBpwb6CMrRvwCxFLdSxXC5zECc4WehR3hRjSAgHRSg',
            //   refresh_token: 'def502006e0d71e642f6c69bf62abc0c890d0a9c09afa276bf4d219f0c1b4b1ed4ef77a7909b94799cc1826a9c1c5945ed89ff47995ae0418ce6da77cd07bef26a41c8418d67dda123f34799ae229c8bf54c663be4d129f64e47d5e34ecc095478086bac3a029ff6876fd16f2410b4f0ad96445d4237f97fd1db717bb71bc2c24ebbd5266614a373330c9162fe22a79700649e970901e15820d627ce76e24b6f011df84f9d92734e4bbc695166c2e12edf55c9da281f3f074d223d42cf15234b42cd5acf2e5030f6f70b65a66508db556b6a9941eeddc3ded64597b11ed80d59ec9c13cdb42edecf6b6bad763de9fbbb18046ac38a7251b6741c1d969ca15f82415547ae7b9b013849f88f0c518023d14edca3517d1b6081ef0cbad85a3d7e144a838a5ec685e470ab26b3fe7812c53c74f50a6574cf17e8419b1e98b12acb5b6df418935a9f6831dda34f89a96781f37e1afc490ad332735132b0503e84d7a256',
            // });
          })
          .catch(error => {
            console.log('error: ', error.response);
            if (typeof error.response.data.error === 'string') {
              this.setState({
                errorMsg: error.response.data.message,
              });
            } else {
              const msgs = Object.keys(error.response.data.error_message);
              const arr = [];
              msgs.forEach((msg) => {
                arr.push('- ' + msg + ': ' + error.response.data.error_message[msg][0]);
              });
              const newArr = arr.join("\n");
              this.setState({
                errorMsg: newArr,
              });
            }
          });
      } else {
        this.setState({
          errorMsg: 'Oops, There is no internet connection.',
        });
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.errorMsg ? (
          <View style={styles.errorMsg}>
            <Text style={styles.errorMsgText}>{this.state.errorMsg}</Text>
          </View>
        ) : null}
        {this.props.defaultUsername && !this.state.errorMsg ? (
          <View style={styles.successMsg}>
            <Text style={styles.successMsgText}>
              Great! Account registered. Let's login.
            </Text>
          </View>
        ) : null}
        <Text style={styles.pageTitle}>Unifi Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={this.state.username}
          onChangeText={this.changeUsername}
          underlineColorAndroid="rgba(0,0,0,0)"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={this.changePassword}
          underlineColorAndroid="rgba(0,0,0,0)"
        />
        <Button style={styles.loginBtn} onPress={this.onLogin} title="Log In" />
        <View style={styles.footer}>
          <TouchableOpacity onPress={this.props.onToggleRegister}>
            <Text>Create an account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 43,
  },
  successMsg: {
    backgroundColor: '#efe',
    padding: 10,
    marginBottom: 20,
    borderRadius: 3,
  },
  successMsgText: {
    color: 'green',
  },
  errorMsg: {
    backgroundColor: '#fee',
    padding: 10,
    marginBottom: 20,
    borderRadius: 3,
  },
  errorMsgText: {
    color: 'red',
    fontSize: hdpi ? 12 : 14,
  },
  pageTitle: {
    fontSize: hdpi ? 13 : 16,
    fontWeight: 'bold',
  },
  footer: {
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: hdpi ? 2 : 10,
    paddingHorizontal: 10,
    marginTop: hdpi ? 6 : 8,
    borderRadius: 3,
  },
  loginBtn: {
    marginTop: 10,
  },
});
