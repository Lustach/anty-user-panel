<template>
  <v-card
    elevation="0"
    style="width: 100%;"
  >
    <v-card-title
      class="pt-0 d-flex justify-space-between"
      style="height: 52px;"
    >
      <div>
        {{ $t('overview.overview') }}
      </div>
      <div>
        <v-btn
          icon
          small
          color="primary"
          @click="refreshProfile"
        >
          <v-icon :size="18">
            mdi-refresh
          </v-icon>
        </v-btn>
      </div>
    </v-card-title>
    <v-alert
      v-if="successfulPaymentAlert"
      color="success"
      text
      class="mb-0"
      dismissible
    >
      {{ $t('common.successfulPayment') }}
    </v-alert>
    <v-alert
      v-if="successfulUpgradeAlert"
      color="success"
      text
      class="mb-0"
      dismissible
    >
      {{ $t('common.successfulPayment') }}
    </v-alert>


    <v-card-text>
      <v-row>
        <!-- E-MAIL АККАУНТА -->
        <v-col cols="4">
          {{ $t("overview.accountEmail") }}
        </v-col>
        <v-col
          cols="8"
          class="text-end"
        >
          {{ profile.username }}
        </v-col>

        <div class="custom-divider" />

        <!-- ПАРОЛЬ -->
        <!-- <v-col cols="4">
          {{ $t("overview.password") }}
        </v-col>
        <v-col
          cols="8"
          class="text-end"
        >
          overview.password
        </v-col>

        <div class="custom-divider" /> -->

        <!-- ПЛАН -->
        <v-col
          v-if="profile.subscription && profile.subscription.plan"
          cols="4"
        >
          {{ $t("overview.plan") }}
        </v-col>
        <v-col
          v-if="profile.subscription && profile.subscription.plan"
          cols="8"
          class="text-end"
        >
          {{ $t(`plans.${profile.subscription.plan}.${profile.subscription.plan}`) }}
          <v-btn
            v-if=" profile.subscription.plan === 'trial' "
            id="overviewButtonPay"
            small
            rounded
            color="primary"
            class="ml-2"
            @click="goToTrialPlansCards"
          >
            {{ $t('common.pay') }}
          </v-btn>
          <v-btn
            v-else
            id="overviewButtonPay"
            small
            rounded
            color="primary"
            class="ml-2"
            @click="goToPlansCards"
          >
            {{ $t('common.upgrade') }}
          </v-btn>
        </v-col>

        <div
          v-if="profile.subscription && profile.subscription.plan"
          class="custom-divider"
        />

        <!-- ДЕЙСТВИТЕЛЕН ДО -->
        <v-col
          v-if="profile.subscription && profile.subscription.expiration"
          cols="4"
        >
          {{ $t("overview.expires") }}
        </v-col>
        <v-col
          v-if="profile.subscription && profile.subscription.expiration"
          cols="8"
          class="text-end"
        >
          {{ moment(profile.subscription.expiration).format('DD MMM YYYY') }}

          <div
            v-if="!isFreeOfCharge()"
            style="display: inline-block"
          >
            <v-btn
              v-if=" profile.subscription.plan !== 'trial' "
              small
              rounded
              outlined
              color="primary"
              class="ml-2"
              @click="renewPlan"
            >
              {{ $t('common.renew') }}
            </v-btn>
          </div>
        </v-col>

        <div
          v-if="profile.subscription && profile.subscription.expiration"
          class="custom-divider"
        />
        <!-- ПРОФИЛИ -->
        <v-col
          v-if="profile.subscription && profile.subscription.browserProfiles"
          cols="4"
        >
          {{ $t("common.browserProfiles") }}
        </v-col>
        <v-col
          v-if="profile.subscription && profile.subscription.browserProfiles"
          cols="8"
          class="text-end"
          :style="{color: countsColor(profile.subscription.browserProfiles.count, profile.subscription.browserProfiles.limit)}"
        >
          {{ profile.subscription.browserProfiles.count + " /" }}
          <span style="font-weight: bold;">
            {{ profile.subscription.browserProfiles.limit }}
          </span>
        </v-col>

        <div
          v-if="profile.subscription && profile.subscription.browserProfiles"
          class="custom-divider"
        />

        <!-- ЮЗЕРЫ -->
        <v-col
          v-if="profile.subscription && profile.subscription.users"
          cols="4"
        >
          {{ $t("common.users") }}
        </v-col>
        <v-col
          v-if="profile.subscription && profile.subscription.users"
          cols="8"
          class="text-end"
          :style="{color: countsColor(profile.subscription.users.count, profile.subscription.users.limit)}"
        >
          {{ profile.subscription.users.count + " /" }}
          <span style="font-weight: bold;">
            {{ profile.subscription.users.limit }}
          </span>
        </v-col>

        <div
          v-if="profile.subscription && profile.subscription.browserProfiles"
          class="custom-divider"
        />

        <!-- ПЛАТЕЖИ -->
        <v-col
          v-if="activePlan && profile.subscription && profile.subscription.expiration"
          cols="4"
        >
          {{ $t("overview.billing") }}
        </v-col>
        <v-col
          v-if="activePlan && profile.subscription && profile.subscription.expiration"
          cols="8"
          class="text-end"
        >
          {{
            profile.subscription.subscriptionId ? $t('overview.yourPlanWillRenewOn') : $t('overview.yourPlanWillNotRenewOn')
          }}
          {{ moment(profile.subscription.expiration).format('DD MMM YYYY') }}
        </v-col>

        <div
          v-if="profile.subscription && profile.subscription.subscriptionId"
          class="custom-divider"
        />

        <!-- ОТПИСАТЬСЯ -->
        <v-col
          v-if="profile.subscription && profile.subscription.subscriptionId"
          cols="12"
          class="text-end"
        >
          <span
            class="linkable-span"
            style="color: #BDBDBD"
            @click="$store.dispatch('main/openDialog', 'unsubscribe')"
          >
            {{ $t('overview.unsubscribe') }}
          </span>
        </v-col>
      </v-row>
    </v-card-text>
    <!-- ДИАЛОГИ -->
    <plans-main-dialog-renew
      v-if="dialogs.mainDialog"
      :mode-renew="true"
    />
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import moment from 'moment'
import {mapFields} from "vuex-map-fields";
import PlansMainDialogRenew from "../components/plans/PlansMainDialogRenew";

export default {
  name: 'Overview',
  components: {
    PlansMainDialogRenew
  },
  data() {
    return {
      moment,
      refreshLoading: false
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      dialogs: 'plans/dialogs',
      successfulPaymentAlert: 'main/successfulPaymentAlert',
      successfulUpgradeAlert: 'main/successfulUpgradeAlert',
    }),
    ...mapFields('plans', ['selectedPlan']),

    activePlan() {
      const {subscription} = this.profile
      if (subscription && subscription.expiration) {
        const expDate = this.moment(this.profile.subscription.expiration).unix()
        const currentUnix = this.moment().unix()

        if (expDate > currentUnix) return true
      }
      return false
    }
  },
  mounted() {
    this.$store.commit('plans/RELOAD_SELECTED_PLAN')
  },
  methods: {
    goToPlansCards() {
      this.$router.push({name: 'Plans'})
      this.$amplitude.getInstance().logEvent('Click to Upgrade', {
        plan: this.profile.subscription.plan
      })

    },
    goToTrialPlansCards() {
      this.$router.push({name: 'Plans'})
      this.$amplitude.getInstance().logEvent('Click to Upgrade', {
        plan: this.profile.subscription.plan
      })

    },
    renewPlan() {
      this.selectedPlan.plan = this.profile.subscription.plan
      this.selectedPlan.profilesCount = this.profile.subscription.browserProfiles.limit
      this.$store.dispatch('plans/openDialog', 'mainDialog')
      this.$amplitude.getInstance().logEvent('Click to Renew', {
        plan: this.profile.subscription.plan
      })
    },
    async refreshProfile() {
      try {
        this.refreshLoading = true
        await this.$store.dispatch('main/loadProfile')
      } catch (error) {
        // error
      } finally {
        this.refreshLoading = false
      }
    },

    countsColor(count, limit) {
      if (count / limit <= 0.5) {
        return "#4CAF50"
      } else if (count / limit > 0.5 && count / limit <= 0.8) {
        return "#FF9800"
      } else if (count / limit > 0.8) {
        return "#F44336"
      }
      return "inherit"
    },
    isFreeOfCharge() {
      if(this.profile.subscription.plan === 'free'
      && this.profile.subscription.users.count > 1
      ){
        return  true
      }

      if (this.profile.subscription.plan === 'free'
          && this.profile.subscription.browserProfiles.limit === 10
          && this.profile.subscription.users.limit === 1) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>