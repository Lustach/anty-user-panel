<template>
  <v-app-bar
    color="primary"
    dense
    dark
    flat
    :max-height="48"
  >
    <v-toolbar-title style="height: 32px;">
      <img
        src="logo.png"
        style="height: inherit; width: inherit; object-fit: contain;"
      >
    </v-toolbar-title>

    <v-spacer />

    <span
      v-if="$i18n.locale !== 'en'"
      class="locale-flag"
      @click="changeLocale('en')"
    >🇬🇧</span>
    <span
      v-if="$i18n.locale !== 'ru'"
      class="locale-flag"
      @click="changeLocale('ru')"
    >🇷🇺</span>
    <span
      v-if="$i18n.locale !== 'cn'"
      class="locale-flag"
      @click="changeLocale('cn')"
    >🇨🇳</span>
    <span class="mr-3" />

    <span class="mr-3" />

    <!-- ИМЯ ПОЛЬЗОВАТЕЛЯ -->
    <span
      v-if="profile !== null"
      style="font-weight: 300;"
    >
      {{ profile.username }}
    </span>

    <!-- КНОПКА ВЫХОДА -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          small
          class="ml-3 mr-1"
          v-on="on"
          @click="logOut"
        >
          <v-icon size="16">
            fas fa-sign-out-alt
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('home.logout') }}</span>
    </v-tooltip>
  </v-app-bar>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import Cookies from 'js-cookie'
import moment from 'moment'

export default {
  name: 'MainTopBar',

  data() {
    return {
      // profile: null
    }
  },

  computed: {
    ...mapFields('main', ['profile']),
  },

  created() {
    this.setLocale();
    this.loadProfile();
  },

  methods: {
    logOut() {
      Cookies.remove('dolphinAntyAccessToken');
      location.href = '/';
    },

    setLocale() {
      const lang = Cookies.get('lang') || navigator.language.slice(0, 2)
      if (lang) {
        if (['ru', 'en', 'cn'].indexOf(lang)!==-1) {
          return this.$i18n.locale = lang;
        }
      }

      this.$i18n.locale = 'en';
    },

    changeLocale(locale) {
      this.$i18n.locale = locale;
      if (locale === 'cn') {
        moment.locale('zh-cn')
      } else {
        moment.locale(locale)
      }
    },

    async loadProfile() {
      try {
        await this.$store.dispatch('main/loadProfile')
      } catch (_) {
        // console.log(_)
      }
    }
  }
}
</script>

<style scoped>
.locale-flag {
  font-size: 24px;
  margin-left: 4px;
  margin-right: 4px;
  cursor: pointer;
  position: relative;
  top: -3px;
}
</style>
