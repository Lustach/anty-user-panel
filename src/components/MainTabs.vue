<template>
  <div>
    <div
      class="mb-8"
      style="font-size: 24px;"
    >
      {{ $t('common.personalArea') }}
    </div>
    <v-tabs
      vertical
      class="anty-main-tabs mb-2"
    >
      <v-tab to="/overview">
        {{ $t('overview.overview') }}
      </v-tab>
      <v-tab to="/affiliate-program">
        {{ $t('affiliateProgram.affiliateProgram') }}
      </v-tab>
    </v-tabs>
    <main-downloads />
  </div>
</template>

<script>
import MainDownloads from "@/components/MainDownloads.vue"
export default {
  name: 'MainTabs',
  components: {
    MainDownloads
  }
}
</script>