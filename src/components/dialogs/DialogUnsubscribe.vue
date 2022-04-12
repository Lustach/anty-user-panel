<template>
  <v-dialog
    :value="dialogs.unsubscribe"
    width="400"
    scrollable
    :transition="false"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ $t('overview.goodbyesAreHard') }}
      </v-card-title>
            
      <v-card-text v-if="profile.subscription && profile.subscription.plan">
        {{ $t('overview.youWillStayOnBasePlan', {plan: capitalize(profile.subscription.plan)}) }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="error"
          :loading="loading"
          @click="cancelSubscription"
        >
          {{ $t('overview.unsubscribe') }}
        </v-btn>

        <v-btn
          text
          color="grey"
          @click="closeDialog"
        >
          {{ $t('common.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DialogUnsubscribe',

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      dialogs: 'main/dialogs'
    })
  },

  methods: {
    closeDialog() {
      this.$store.dispatch('main/closeDialog', 'unsubscribe')
    },

    async cancelSubscription() {
      try {
        this.loading = true

        const response = await this.api('/subscription/cancel')
        const { status } = response

        if (status === 200) {
          this.$amplitude.getInstance().logEvent('Payment Unsubcribe', {
            plan: this.profile.subscription.plan
          })
        
          await this.$store.dispatch('main/loadProfile');
          this.$store.dispatch('main/alert', {
            color: 'success',
            message: this.$t('common.success')
          })
          this.closeDialog()
        }
        
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    
    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    },
  }
}
</script>

