<template>
  <v-main>
    <v-row
      align-content="start"
      class="mt-2"
    >
      <!-- DEVELOPING ALERT -->
      <!-- <v-col
      cols="10"
      offset="1"
      lg="8"
      offset-lg="2"
      xl="4"
      offset-xl="4"
      class="mt-3"
    >
      <v-alert
        type="info"
        text
        color="primary"
        class="my-6"
      >
        {{ $t('home.comingSoon') }}
      </v-alert>
    </v-col> -->
      
      <!-- ВКЛАДКИ -->
      <v-col
        cols="12"
        lg="8"
        offset-lg="2"
        xl="4"
        offset-xl="4"
        class="d-flex justify-start"
      >        
        <main-tabs />
        <router-view />
      </v-col>
    </v-row>
  </v-main>
</template>


<script>
import MainTabs from "@/components/MainTabs.vue"

export default {
  name: 'Tabs',

  components: {
    MainTabs
  }
};
</script>