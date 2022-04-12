import {mixinDialogActions, mixinDialogGetters, mixinDialogMutations} from '@/mixins/vuexDialogs'

import {getField, updateField} from 'vuex-map-fields'
import selectedPlan from '../constants/selectedPlan'
export default {
  namespaced: true,
  state: {
    selectedPlan,
    dialogs: {
      mainDialog: false,
      mainDialogTrial: false
    },
    promocode: {
      isSet: false,
      discount: 0
    },
    balance: {},
    needPay : false
  },

  getters: {
    ...mixinDialogGetters,
    getField,

    selectedPlan: state => state.selectedPlan,
    promocode: state => state.promocode,
    balance: state => state.balance,
    needPay: state => state.needPay,
  },

  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_DISCOUNT: (state, discount) => {
      state.selectedPlan.discount = discount
    },

    SET_PROMOCODE: (state, payload) => {
      state.promocode = {
        isSet: payload.isSet,
        discount: payload.discount
      }
    },

    SET_BALANCE: (state, payload) => state.balance = payload,
    RELOAD_SELECTED_PLAN: state => {
      state.selectedPlan = selectedPlan
      state.balance = {}
    },

  },

  actions: {
    ...mixinDialogActions,

    async createPaymentInvoice({state}) {

      const data = {
        plan: state.selectedPlan.plan.toLowerCase(),
        usersLimit: parseInt(state.selectedPlan.additionalUsers, 10) + 1,
        browserProfilesLimit: parseInt(state.selectedPlan.profilesCount, 10),
        days: parseInt(state.selectedPlan.prolongMonths) * 30,
        provider: 'cloudpayments',
        promo: state.selectedPlan.promocode ? state.selectedPlan.promocode : null
      }
      switch (state.selectedPlan.paymentMethod) {
      case 'card':
        data.provider = 'cloudpayments'
        break;
      case 'crypto':
        data.provider = 'coinbase'
        break;
      }

      if (data.plan === 'free') {
        data.browserProfilesLimit += parseInt(state.selectedPlan.additionalProfiles, 10)
        data.usersLimit = 1
      }

      const response = await this._vm.api.post(`/subscription/invoices`, data)
      return response
    },

    async createUpdateInvoice({state, rootGetters, dispatch}) {
      let profilesCount = state.selectedPlan.profilesCount

      if (typeof profilesCount == 'object')
        profilesCount = profilesCount.value

      const data = {
        plan: state.selectedPlan.plan.toLowerCase(),
        usersLimit: parseInt(state.selectedPlan.additionalUsers, 10) + 1,
        browserProfilesLimit: profilesCount,
        days: parseInt(state.selectedPlan.prolongMonths) * 30,
        provider: 'upgrade',
        promo: state.selectedPlan.promocode ? state.selectedPlan.promocode : null,
        teamId: rootGetters['main/profile'].teamId
      }

      switch (state.selectedPlan.paymentMethod) {
      case 'card':
        data.provider = 'cloudpayments'
        break;
      case 'crypto':
        data.provider = 'coinbase'
        break;
      }
      if (data.plan === 'free') {
        data.browserProfilesLimit= state.selectedPlan.additionalProfiles
        data.browserProfilesLimit += 10
        data.usersLimit = 1

      }


      try {
        if (data.days === 0) {
          delete data['days']
        }
        const response = await this._vm.api.post(`/subscription/invoices/upgrade`, data)
        return response
      } catch (error) {
        dispatch('main/alert', {
          color: 'red',
          message: error.response.data.error.text ? error.response.data.error.text : error.response.data.error
        }, {
          root: true
        })
      }

    },

    async getBalanceByPlan({state, rootGetters, commit, dispatch}) {

      let profilesCount = state.selectedPlan.profilesCount

      if (typeof profilesCount == 'object')
        profilesCount = profilesCount.value

      const data = {
        plan: state.selectedPlan.plan.toLowerCase(),
        usersLimit: parseInt(state.selectedPlan.additionalUsers, 10) + 1,
        browserProfilesLimit: profilesCount,
        provider: 'upgrade',
        promo: state.selectedPlan.promocode ? state.selectedPlan.promocode : null,
        teamId: rootGetters['main/profile'].teamId,
        refund: false,
      }


      if (state.selectedPlan.prolongMonths) {
        data.days = parseInt(state.selectedPlan.prolongMonths) * 30

      }

      if(
        !state.selectedPlan.prolongMonths &&
        rootGetters['main/profile'].subscription.plan === 'free' &&
            rootGetters['main/profile'].subscription.browserProfiles.limit === 10 )
      {
        // eslint-disable-next-line no-debugger

        data.days = 30
      }


      if (data.plan === 'free') {
        data.browserProfilesLimit= state.selectedPlan.additionalProfiles
        data.browserProfilesLimit += 10
        data.usersLimit = 1
      }
      if (data.plan === 'enterprise' &&   data.browserProfilesLimit < 1000) {
        data.browserProfilesLimit = 1000
      }

      if(state.selectedPlan.paymentMethod === 'card') {
        data.provider = 'cloudpayments'
      }
      if(state.selectedPlan.paymentMethod === 'crypto') {
        data.provider = 'coinbase'
      }
      try {
        if (data.days === 0) {
          delete data['days']
        }
        const response = await this._vm.api.post(`/subscription/balance`, data)
        if (response.status === 200 && response.data) {
          commit('SET_BALANCE', response.data.data)
          return response
        }
      } catch (error) {
        dispatch('main/alert', {
          color: 'red',
          message: error.response.data.error.text ? error.response.data.error.text : error.response.data.error
        }, {
          root: true
        })


        commit('SET_BALANCE', false)
      }

    },


    async sendPromocode({commit}, value) {
      try {
        const response = await this._vm.api.post(`/subscription/check-promo`, {
          promo: value
        })
        if (response.status === 200 && response.data && response.data.data && response.data.data.exists) {
          commit("SET_DISCOUNT", response.data.data.discount)
          commit("SET_PROMOCODE", {
            isSet: true,
            discount: parseInt(response.data.data.discount, 10)
          })
        } else {
          // commit("SET_DISCOUNT", '0')
          // commit("SET_PROMOCODE", { isSet: true, discount: 0 })
        }
      } catch (error) {
        console.log(error)
        // commit("SET_DISCOUNT", '0')
        // commit("SET_PROMOCODE", { isSet: true, discount: 0 })
      }
    },

    async setPromocode({commit}, payload) {
      commit("SET_PROMOCODE", payload)
    }
  }
}
