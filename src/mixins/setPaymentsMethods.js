import axios from 'axios'
export default {
  data() {
    return {
      paymentsMethods: ['card']
    }
  },
  mounted() {
    this.setPaymentsMethods()
  },
  methods: {
    setPaymentsMethods() {
      axios.get('https://api.ip.sb/geoip').then(res => {
        if (res.data.country_code != 'CY') {
          this.paymentsMethods.push('crypto');
        }
        this.paymentsMethods.push('capitalist', 'usdt');
      }).catch(() => {
        this.paymentsMethods.push('crypto');
        this.paymentsMethods.push('capitalist', 'usdt');
      })
    },
  }
}