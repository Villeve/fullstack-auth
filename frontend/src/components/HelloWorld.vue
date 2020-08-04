<template>
  <div class="hello">
    <button @click="logout()">
      Logout
    </button>
    <button @click="fetchUserInfo()">
      Fetch user information
    </button>
    <button @click="fetchSecretMessage()">
      Fetch secret message
    </button>
    <div v-if="showUserInfo">
      <p> Email: {{ decodedToken.data.payload.email || "undefined" }}</p>
      <p> Family name: {{ decodedToken.data.payload.family_name || "undefined" }}</p>
      <p> Given name: {{ decodedToken.data.payload.given_name || "undefined" }}</p>
      <p> Username: {{ decodedToken.data.payload.preferred_username || "undefined" }}</p>
      <p> Realm access: {{ decodedToken.data.payload.realm_access.roles || "undefined" }}</p>
      <p> Resource access: {{ decodedToken.data.payload.resource_access.account.roles || "undefined" }}</p>
    </div>
    <div v-if="showSecretMessage">
      <p> {{ secretMessage.data || secretMessage }}</p>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
const logout = require('../main.js');

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      decodedToken: {},
      showUserInfo: false,
      showSecretMessage: false,
      secretMessage: "You are not an admin!",
    }
  },
  methods: {
    logout: function() {
      logout.logout()
    },
    async fetchUserInfo() {
      this.showUserInfo = true;
      this.showSecretMessage = false;

      this.decodedToken = await axios.get('http://localhost:8000/api/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.vueToken}`
        }
      })
    },
    async fetchSecretMessage() {
      this.showUserInfo = false;
      this.showSecretMessage = true;

      this.secretMessage = await axios.get('http://localhost:8000/api/message', {
        headers: {
          'Authorization': `Bearer ${localStorage.vueToken}`
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
