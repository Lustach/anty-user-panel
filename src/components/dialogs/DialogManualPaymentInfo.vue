<template>
  <v-dialog
    :value="dialogs.manualPaymentInfoDialog"
    width="400"
    scrollable
    :transition="false"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
  >
    <v-card>
      <v-card-title />
      <v-card-text>
        <div v-html="$t('plans.dialogManualPaymentInfo.description',{sum})" />
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn
          type="primary"
          text
          @click="closeDialog"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "DialogManualPaymentInfoUSDT",
  props:{
    sum: {
      required: true,
      default: '',
      type: String
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      dialogs: 'main/dialogs'
    })
  },

  methods: {
    closeDialog() {
      this.$store.dispatch('main/closeDialog', 'manualPaymentInfoDialog')
    },
    test(string){
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
}
</script>

<style scoped>

</style>
