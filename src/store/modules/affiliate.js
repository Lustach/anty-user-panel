import {
  mixinDialogMutations,
  mixinDialogActions,
  mixinDialogGetters
} from '@/mixins/vuexDialogs'

import { getField, updateField } from 'vuex-map-fields'

export default {
  namespaced: true,
  state: {
    transactions: [],
    loading: {
      mainTable: false
    },
    pagination: {},
  },

  getters: {
    ...mixinDialogGetters,
    getField,
    
    transactions: state => state.transactions,
    loading: state => state.loading,
    pagination: state => state.pagination,
  },
  
  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_TRANSACTIONS: (state, payload) => {
      state.transactions = payload
    },

    SET_LOADING: (state, payload) => {
      state.loading[payload.key] = payload.value
    },
    
    SET_PAGINATION: (state, payload) => {
      state.pagination = payload
    },
  },

  actions: {
    ...mixinDialogActions,

    async loadTransactions(context, payload = null) {
      context.commit('SET_LOADING', {
        key: 'mainTable',
        value: true
      })

      try {
        let request = '/profile/refs-stat?'

        if (payload && payload.page) {
          request += `page=${payload.page}&`
        }
        if (payload && payload.itemsPerPage) {
          request += `limit=${payload.itemsPerPage}&`
        }
        if (payload && payload.sort) {
          request += `sort=${payload.sort}&`
        }
        if (request.endsWith('&')) {
          request = request.slice(0, request.length - 1)
        }
        if (payload === null || request.endsWith('?')) {
          request += 'page=1&limit=10'
        }

        const response = await this._vm.api.get(request)
        // const response = await axios.get(`https://f5e8dc53-97bf-4988-bf96-190c1e27b0ee.mock.pstmn.io${request}`)

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          const data = {
            response: response.data,
            sort: payload && payload.sort ? payload.sort : null
          }
          context.dispatch('setPagination', data)
          
          context.commit('SET_TRANSACTIONS', response.data.data)
        }
      } catch (error) {
        // error
      } finally {
        context.commit('SET_LOADING', {
          key: 'mainTable',
          value: false
        })
      }
    },

    async setPagination (context, payload) {
      const pagination = {
        currentPage: parseInt(payload.response.current_page, 10),
        lastPage: parseInt(payload.response.last_page, 10),
        perPage: parseInt(payload.response.per_page, 10),
        total: parseInt(payload.response.total, 10),
        from: parseInt(payload.response.from, 10),
        to: parseInt(payload.response.to, 10),
        sort: payload.sort
      }
      await context.commit('SET_PAGINATION', pagination)
    },
  }
}