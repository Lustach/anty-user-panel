import {
  mixinDialogMutations,
  mixinDialogActions,
  mixinDialogGetters
} from '@/mixins/vuexDialogs'

import { getField, updateField } from 'vuex-map-fields'

export default {
  namespaced: true,
  state: {
    profile: {},
    alert: {
      color: '',
      message: ''
    },
    dialogs: {
      alert: false,
      unsubscribe: false,
      unsubscribePlan: false,
      manualPaymentInfoDialog: false,
      manualPaymentInfoDialogUSDT: false,
    },
    usdRates: {
      RUB: 74
    },
    successfulPaymentAlert: false,
    successfulUpgradeAlert: false
  },

  getters: {
    ...mixinDialogGetters,
    getField,

    profile: state => state.profile,
    alert: state => state.alert,
    usdRates: state => state.usdRates,
    successfulPaymentAlert: state => state.successfulPaymentAlert,
    successfulUpgradeAlert: state => state.successfulUpgradeAlert,
  },

  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_ALERT: (state, alert) => {
      state.alert = alert
    },

    OPEN_ALERT: (state) => {
      state.dialogs.alert = true
    },

    CLOSE_ALERT: (state) => {
      state.dialogs.alert = false
    },

    SET_PROFILE: (state, payload) => {
      state.profile = payload
      state.profile.balance = payload.balance || 0
    },

    SET_USD_RATES: (state, payload) => {
      state.usdRates = payload
    },
  },

  actions: {
    ...mixinDialogActions,

    async alert (context, alert) {
      context.commit('CLOSE_ALERT')
      context.commit('SET_ALERT', alert)
      context.commit('OPEN_ALERT')
      setTimeout(() => {
        context.commit('CLOSE_ALERT')
      }, 5000)
    },

    async closeAlert (context) {
      context.commit('CLOSE_ALERT')
    },

    async loadProfile (context) {
      const response = await this._vm.api.get('/profile/?with_ref_stat=1')
      // const response = await axios('https://69857a3e-bc7f-4e4c-8140-b5205ccb88bc.mock.pstmn.io/profile/?with_ref_stat=1')

      const { status, data } = response
      if (status === 200) {
        const subscription = await this._vm.api.get('/subscription')
        if (subscription.status === 200 && subscription.data && subscription.data.data) {
          context.commit('SET_PROFILE', Object.assign({}, data.data,  {subscription: subscription.data.data}))
        }
        if (data && data.data && data.data.username) {
          this._vm.$amplitude.getInstance().setUserId(data.data.username)
        }
      }
    },

    async loadUsdRates (context) {
      const response = await this._vm.api.get('/subscription/currency-rates')
      if (response.status === 200 && response.data) {
        context.commit('SET_USD_RATES', response.data)
      }
    },
  }
}
