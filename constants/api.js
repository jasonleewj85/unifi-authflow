export default {
  //baseURL: 'https://heimdall-5.6.test',
  baseURL: 'https://heimdall.tcennoc.unifi.space',
  facebookURL: 'https://graph.facebook.com/v3.0/me',
  googleURL: 'https://www.googleapis.com/userinfo/v2/me',
  acceptHeader: 'application/vnd.heimdall.v1+json',
  contentType: 'application/json',
  auth: {
    token: '/oauth/token',
    login: '/oauth/login',
  },
  user: {
    // register: '/user/register',
    // profile: '/user/profile',
  },
  account: {
    register: '/register',
  },
  device: {
    idfa: '/device/idfa',
  },
};