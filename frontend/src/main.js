import Vue from 'vue'
import Keycloak from 'keycloak-js'
import App from './App.vue'

Vue.config.productionTip = false

//////////////////////////////

let initOptions = {
  url: 'http://0.0.0.0:8080/auth', realm: 'keycloak-demo', clientId: 'vue-test-app', onLoad: 'login-required'
}

let keycloak = Keycloak(initOptions);

keycloak.init({ onLoad: initOptions.onLoad }).success((auth) => {

  if (!auth) {
    console.log("RELOADING WINDOW")
    window.location.reload();
  } else {
    console.log("Authenticated!")
  }

  new Vue({
    render: h => h(App),
  }).$mount('#app')

  /*
  * Not the best practise security wise to save the token to localstorage,
  * it should be saved to vuex store once implemented
  */
  localStorage.setItem("vueToken", keycloak.token);
  localStorage.setItem("vueRefreshToken", keycloak.refreshToken);

  setInterval(() => {
    keycloak.updateToken(70).success((refreshed) => {
      if (refreshed) {
        console.log('Token refreshed' + refreshed);
      } else {
        console.warn('Token not refreshed, valid for '
          + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
      }
    }).error(() => {
      console.error('Failed to refresh token');
    });


  }, 60000)

}).error(() => {
  console.log("Authentication failed!")
});

const logout = () => {
  keycloak.logout()
}

export { logout }