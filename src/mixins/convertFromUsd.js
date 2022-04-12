import { mapGetters } from 'vuex'
export default {

  computed: {
    ...mapGetters({
      usdRates: 'main/usdRates'
    })
  },

  methods: {
    convertFromUsd(amount, currency) {
      return amount * this.usdRates[currency.toLowerCase()]
    }
  }
}