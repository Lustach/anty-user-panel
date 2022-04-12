<template>
  <v-app>
    <alert />
    <main-top-bar />
    <dialog-unsubscribe v-if="dialogs.unsubscribe" />
    <unsubscribe-plan-dialog v-if="dialogs.unsubscribePlan" />

    <v-main>
      <!-- РЕНДЕРИТЬ ТАБЫ -->
      <tabs v-if="showTabs" />

      <!-- НЕ РЕНДЕРИТЬ ТАБЫ -->
      <router-view v-else />
    </v-main>
  </v-app>
</template>

<script>
import Tabs from "@/views/Tabs.vue"
import MainTopBar from "@/components/MainTopBar.vue"
import DialogUnsubscribe from "@/components/dialogs/DialogUnsubscribe.vue"
import Alert from '@/components/Alert.vue'
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import moment from 'moment'
import Cookies from 'js-cookie'
import UnsubscribePlanDialog from "./components/plans/UnsubscribePlanDialog";

export default {
  name: 'App',

  components: {
    UnsubscribePlanDialog,
    Tabs,
    MainTopBar,
    Alert,
    DialogUnsubscribe
  },

  data() {
    return {
      moment
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      dialogs: 'main/dialogs',
    }),
    ...mapFields('plans', ['selectedPlan']),
    ...mapFields('main', ['successfulPaymentAlert']),

    showTabs() {
      const tabs = [
        "Overview",
        "Affiliate"
      ]
      return tabs.includes(this.$route.name)
    }
  },

  watch: {
    'profile': {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal.subscription && oldVal.subscription && newVal.subscription.plan !== oldVal.subscription.plan) {
          this.successfulPaymentAlert = false
        }
        if (newVal.subscription && newVal.subscription.users) {
          this.selectedPlan.additionalUsers = newVal.subscription.users.limit - 1
        }
        if (newVal.team && newVal.team.promo && newVal.team.promo.trim() && parseInt(newVal.team.usedPromo, 10) === 0) {
          this.selectedPlan.promocode = newVal.team.promo
          this.selectedPlan.discount = newVal.team.promoDiscount
          this.selectedPlan.disablePromocode = true
        } else if (newVal.team && newVal.team.promo && newVal.team.promo.trim() && parseInt(newVal.team.usedPromo, 10) === 1) {
          this.selectedPlan.promocode = ''
          this.selectedPlan.discount = '0'
          this.selectedPlan.disablePromocode = false
        }

        if (
          newVal.team &&
          newVal.team.created_at &&
          this.moment(newVal.team.created_at).unix() <= 1631728799 &&
          !newVal.team.hadTransactions
        ) {
          if (this.selectedPlan.discount === '0' || parseInt(this.selectedPlan.discount, 10) < 20) {
            this.selectedPlan.discount = '20'
          }
        }
      }
    }
  },

  async created() {
    if (Cookies.get('dolphinAntyAccessToken')) {
      this.api.defaults.headers.Authorization = `Bearer ${window.atob(window.decodeURIComponent(Cookies.get('dolphinAntyAccessToken')))}`
    }

    if (this.$route.query.token) {
      await this.signInByToken(this.$route.query.token)
    }

    if (!Cookies.get('dolphinAntyAccessToken')) {
      location.href = '/'
    }

    this.$store.dispatch('main/loadUsdRates')
  },

  methods: {
    signInByToken(token) {
      Cookies.set('dolphinAntyAccessToken', window.decodeURIComponent(window.btoa(token)), {
        expires: 7
      })
      this.api.defaults.headers.Authorization = `Bearer ${token}`
      this.$router.replace({'query': null});
    }
  }
};
</script>

<style>
@import './assets/styles/main.css';
</style>
