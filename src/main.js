import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Cookies from 'js-cookie'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import axios from 'axios'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import amplitude from 'amplitude-js'

Vue.config.productionTip = false

const isDev = location.href.search("localhost") > -1
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTg3MywidXNlcm5hbWUiOiJ0ZXN0Rm9yUmVjdXJyZWN0QHBheW1lbnQuY29tIiwicm9sZSI6ImFkbWluIiwidGVhbUlkIjoxNDgzfQ.ZgM_YstSFaz0OBPmaKuBwy-W8Xc96s-HpOexEVWrrdY'
if (isDev) {
  Cookies.set('dolphinAntyAccessToken', window.decodeURIComponent(window.btoa(token)), {
    expires: 7
  })
}

amplitude
  .getInstance()
  .init(`${isDev ? 'e8c66f87bfc4828dd7029beb9afda19b' : 'cc69d5080af9e4710e5b0d1d268ca067'}`);
Object.defineProperty(Vue.prototype, '$amplitude', { value: amplitude });

const api = axios.create({
  baseURL: isDev ? 'https://anty-api.com' : 'https://anty-api.com'
})

Vue.prototype.api = api;

new Vue({
  i18n,
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
