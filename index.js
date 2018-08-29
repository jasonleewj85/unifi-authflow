import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { IDFA } from '@ptomasroos/react-native-idfa';
import axios from 'axios';
import API from './constants/api';
import Login from './components/login';
import Register from './components/register';
import Button from './components/button';
import FBIcon from "./components/FBIcon";
import GoogleIcon from "./components/GoogleIcon";
// import Resolution from "./style/Resolution";

const widthRatio = 0.8;
const width = Dimensions.get('window').width * widthRatio;
const defaultAvatar = require("./assets/default-avatar.png");
const unifiLogo = require("./assets/unifi_logo.png");
const hdpi = PixelRatio.get() < 2 ? true : false ;

// const height = Dimensions.get('window').height * widthRatio;

// const height = Resolution.screenHeight;

// const buttonSize = Resolution.isTablet ? 200 : Resolution.deviceWidth * 0.4;

export default class AuthFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalShow: false,
      modalType: "Register",
      isModalRegister: false,
      isLogin: false,
      hasLoggedIn: false,
      loggedAvatarURL: 'http://www.rammandir.ca/sites/default/files/default_images/defaul-avatar_0.jpg',
      loggedName: '',
      IDFA: '',
      accessToken: '',
      defaultUsername: '',
    };
  }

  componentDidMount() {
    IDFA.getIDFA().then((idfa) => {
      this.setState({ IDFA: idfa, });
      console.log(idfa);
      this.getClientCredentialToken(idfa);
      // this.checkIdfa(idfa);
    }).catch((e) => {
      console.error(e);
    });
  }

  getClientCredentialToken = (idfa) => {
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
        client_id: this.props.clientId,
        client_secret: this.props.clientSecret,
        grant_type: 'client_credentials',
        scope: 'device',
      },
    };

    http.request(params).then(response => {
      console.log('cc at: ', response.data.access_token);
      this.setState({ accessToken: response.data.access_token });
      this.checkIdfa(idfa);
    }).catch(error => {
      console.log('error: ', error);
    });
  }

  checkIdfa = (idfa) => {
    const http = axios.create({
      baseURL: API.baseURL,
      timeout: 10000,
      headers: {
        Accept: API.acceptHeader,
        'Content-Type': API.contentType,
        Authorization: 'Bearer ' + this.state.accessToken,
      },
    });
    const params = {
      method: 'GET',
      url: API.device.idfa,
      responseType: 'json',
      params: {
        idfa,
      },
    };

    http.request(params).then(response => {
      console.log('idfa response: ', response);
      console.log('idfa response: ', response.data.response.length === 0);
      if (response.data.response.length !== 0) {
        this.setState({
          hasLoggedIn: true,
          loggedAvatarURL: response.data.response.avatar ? response.data.response.avatar: this.state.loggedAvatarURL,
          loggedName: response.data.response.name,
          defaultUsername: response.data.response.username,
        });
      }
    }).catch(error => {
      console.log('error: ', error);
    });
  }

  onToggleRegister = () => {
    this.setState({ modalType: "Register", });
  }

  showSignUpScreen = () => {
    this.setState({ hasLoggedIn: false, defaultUsername: '' });
  }

  showRegisterModal = () => {
    this.setState({ isModalRegister: !this.state.isModalRegister, isModalShow: !this.state.isModalShow, modalType: "Register" });
  }

  showLoginModal = () => {
    this.setState({ isModalShow: !this.state.isModalShow, modalType: "Login" });
  }

  onToggleLogin = (data) => {
    this.setState({
      isLogin: !this.state.isLogin,
      defaultUsername: data ? data.username : '',
      modalType: "Login",
    });
  }

  onRegister = () => {

  }

  render() {
    console.log('state: ', this.state);
    return (
      <View style={styles.container}>
        {
          this.state.loggedAvatarURL !== '' && this.state.hasLoggedIn ?
            <View style={styles.btnContainer}>
              <View
                style={styles.avatarCircle}
              >
                <Image style={styles.avatarBtn} source={this.state.loggedAvatarURL !== '' ? { uri: this.state.loggedAvatarURL } : defaultAvatar} />
              </View>
              <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold", color: "#A2A2A2" }}>
                  Hey! {this.state.loggedName}
              </Text>
              <TouchableOpacity
                onPress={this.showLoginModal}
                style={[styles.button, { backgroundColor: "#0CC900" }]}
              >
                <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
                  CONTINUE AS {this.state.loggedName}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: 20 }}
              onPress={this.showRegisterModal}
              >
              <Text style={{ textDecorationLine: "underline" }}>
                  Sign in with different profile
              </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={[styles.buttonStyle, this.props.style]} onPress={this.onToggleRegister}>
                <View>
                  <Image style={styles.avatarBtn} source={{ uri: this.state.loggedAvatarURL }} />
                  <Text style={[styles.captionStyle, this.props.captionStyle]}>Login as {this.state.loggedName}</Text>
                </View>
              </TouchableOpacity> */}
            </View>
            :
            <View style={styles.btnContainer}>
              {/* <Button type="facebook" onPress={this.onRegisterFacebook} title="facebook" />
              <Button type="google" onPress={this.onRegisterGoogle} title="Google" />
              <Button onPress={this.onToggleRegister} title={this.props.title || 'LOGIN WITH UNIFI'} /> */}
              <Text style={{ fontSize: 25, color: "grey", fontWeight: "normal", marginBottom: 10 }}>
                  WELCOME
              </Text>
              {/* <View
                style={styles.avatarCircle}
              /> */}
              <Image
                  resizeMode="contain"
                  source={unifiLogo}
                  style={{width: "40%", height: 150}}
                />
              <Text style={{ fontSize: 17, color: "grey", fontWeight: "normal", marginBottom: 30, textAlign: "center", marginTop: 10 }}>
                  We're improving to make your{'\n'}experience better with our new{'\n'}secured Unifi ID 
              </Text>
              {/* <TouchableOpacity
                style={[styles.button, { backgroundColor: "#3B5998" }]}
              >
                <FBIcon color="white" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#DB4437" }]}
              >
                <GoogleIcon color="white" size={30} />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={this.showRegisterModal}
                style={[styles.button, { backgroundColor: "#EF5B2F" }]}
              >
                <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
                  SIGN UP WITH UNIFI ID
                </Text>
              </TouchableOpacity>

              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{}}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={this.showLoginModal}
                >
                  <Text style={{ textDecorationLine: "underline" }}>
                    Login Here
                  </Text>
                </TouchableOpacity>
              </View>


              {/* <TouchableOpacity style={[styles.buttonStyle, this.props.style]} onPress={this.onToggleRegister}>
              <Text style={[styles.captionStyle, this.props.captionStyle]}>{this.props.title || 'LOGIN WITH UNIFI'}</Text>
            </TouchableOpacity> */}
            </View>
        }
        <Modal
          isVisible={this.state.isModalShow}
          onSwipe={() => this.setState({ isModalShow: false })}
          swipeDirection="down"
          avoidKeyboard
          style={styles.container}
        >
          {Platform.OS === 'ios' && <StatusBar hidden />}
          <View style={[styles.modalbox, this.props.modalStyle]}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => this.setState({ isModalShow: false })}>
              <Image source={require('./assets/close.png')} style={styles.closeModal} />
            </TouchableOpacity>
            {/* <Text>Your IDFA is : {this.state.IDFA}</Text> */}

            {
              this.state.modalType !== "Register" ?
                <Login
                  onToggleLogin={this.onToggleLogin}
                  onToggleRegister={this.onToggleRegister}
                  onLoggedIn={this.props.onLoggedIn}
                  idfa={this.state.IDFA}
                  defaultUsername={this.state.defaultUsername}
                  clientId={this.props.clientId}
                  clientSecret={this.props.clientSecret}
                />
                :
                <Register
                  onToggleLogin={this.onToggleLogin}
                  onToggleRegister={this.onToggleRegister}
                  idfa={this.state.IDFA}
                />
            }
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  btnContainer: {
    position: 'relative',
    // backgroundColor: 'red',
    alignItems: "center",
    justifyContent: "center",
    width: width,
  },
  avatarBtn: {
    width: 150,
    height: 150,
    borderRadius: 150/2,
  },
  buttonStyle: {
    backgroundColor: 'red',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  captionStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalbox: {
    backgroundColor: 'white',
    position: 'absolute',
    left: hdpi ? 10 : 15,
    right: hdpi ? 10 : 15,
    // bottom: 1,
    // top: 1,
    // paddingTop: 10,
    // paddingBottom: 50,
    paddingHorizontal: hdpi ? 15 : 15,
    borderRadius: 3,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    position: 'absolute',
    paddingRight: 5,
    paddingTop: 5,
  },
  closeModal: {
    //position: 'absolute',
    // top: 5,
    // right: -5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    width: hdpi ? 20 : 30,
    height: hdpi ? 20 : 30,
    tintColor: '#bbb',
  },
  button: {
    marginTop: 20,
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5
  },
  avatarCircle: {
    height: 150,
    width: 150,
    borderRadius: 100,
    backgroundColor: "#E4E4E4",
    marginBottom: 50
  }
});
