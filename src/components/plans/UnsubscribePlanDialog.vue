<template>
  <v-dialog
    :value="dialogs.unsubscribePlan"
    width="400"
    scrollable
    :transition="false"
    style="    border-radius: 24px !important;"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
  >
    <v-card class="rounded-xl">
      <v-card-title
        class="text-h5 rounded-xl "
        v-html="$t('plans.unsubscribeTitle')"
      />

      <v-card-text v-if="profile.subscription && profile.subscription.plan">
        {{ $t('plans.unsubscribeDesc') }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="error"
          :loading="loading"
          @click="continueGoToFree"
        >
          {{ $t('plans.buttonGo') }}
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
import {mapFields} from "vuex-map-fields";

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
    }),
    ...mapFields('plans', ['needPay']),

  },

  methods: {
    closeDialog() {
      this.$store.dispatch('main/closeDialog', 'unsubscribePlan')
    },

    async continueGoToFree() {
      this.needPay = true
      this.closeDialog()
      console.log(this.needPay)
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    },
  }
}
</script>




<style scoped>

</style>
