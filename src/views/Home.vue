<template>
  <div>
    <!-- УВЕДОМЛЕНИЕ О СКОПИРОВАННОЙ ССЫЛКЕ -->
    <v-snackbar
      v-model="snackbarLinkCopied"
      timeout="3000"
    >
      {{ $t('common.copied') }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="snackbarLinkCopied = false"
        >
          {{ $t('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-app-bar
      color="#B645EE"
      dense
      dark
      :height="48"
    >
      <v-toolbar-title>
        <img
          src="logo.png"
          style="height: 32px; width: auto; margin-top: 8px;"
        >
      </v-toolbar-title>

      <v-spacer />

      <!-- ЯЗЫКИ -->
      <span
        v-if="$i18n.locale !== 'en'"
        class="locale-flag"
        @click="$i18n.locale = 'en'"
      >🇬🇧</span>
      <span
        v-if="$i18n.locale !== 'ru'"
        class="locale-flag"
        @click="$i18n.locale = 'ru'"
      >🇷🇺</span>
      <span
        v-if="$i18n.locale !== 'cn'"
        class="locale-flag"
        @click="$i18n.locale = 'cn'"
      >🇨🇳</span>
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
    
    <v-main>
      <v-container class="mt-7">
        <!-- DEVELOPING ALERT -->
        <v-row>
          <v-col :sm="6">
            <v-alert
              type="info"
              text
              color="#B645EE"
            >
              {{ $t('home.comingSoon') }}
            </v-alert>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <a href="/">&larr; {{ $t('home.backToWebsite') }}</a>
          </v-col>
        </v-row>

        <v-row>
          <!-- DOWNLOADS -->
          <v-col :md="6">
            <v-card outlined>
              <v-card-title style="font-weight: 300;">
                {{ $t('common.download') }}
              </v-card-title>
              <v-card-text>
                <v-list dense>
                  <v-list-item-group
                    color="primary"
                  >
                    <v-list-item href="https://anty.dolphin.ru.com/download/?platform=win">
                      <v-list-item-icon>
                        <v-icon>fab fa-windows</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Windows</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item href="https://anty.dolphin.ru.com/download/?platform=mac">
                      <v-list-item-icon>
                        <v-icon>fab fa-apple</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>MacOS</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item href="https://anty.dolphin.ru.com/download/?platform=mac-m1">
                      <v-list-item-icon>
                        <v-icon>fab fa-apple</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>MacOS M1</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item href="https://anty.dolphin.ru.com/download/?platform=linux">
                      <v-list-item-icon>
                        <v-icon>fab fa-linux</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Linux</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- REFERAL PROGRAM -->
          <v-col :md="6">
            <v-card outlined>
              <v-card-title style="font-weight: 300;">
                {{ $t('home.referalProgram') }}
              </v-card-title>
              <v-card-text>
                <v-text-field 
                  v-if="profile && 'id' in profile"
                  :label="$t('home.referalLink')"
                  filled
                  readonly
                  :value="`https://anty.dolphin.ru.com/a/${profile.id}`"
                >
                  <template #append>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn 
                          icon
                          x-small
                          @click="copyRefLink"
                          v-on="on"
                        >
                          <v-icon>far fa-copy</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('common.copy') }}</span>
                    </v-tooltip>
                  </template>
                </v-text-field>

                <div v-if="profile && 'ref_stat' in profile && 'users_count' in profile.ref_stat">
                  {{ $t('ref.registeredUsers') }}: {{ profile.ref_stat.users_count }}
                </div>

                <!-- <v-alert type="info" text>
                  <div v-html="$t('ref.info')" />
                </v-alert>                 -->
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  <!-- </v-app> -->
  </div>
</template>

<script>
import Cookies from 'js-cookie'
// import atob from 'atob'

export default {
  name: 'Home',

  data() {
    return {
      profile: null,
      snackbarLinkCopied: false
    }
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
        if (['ru', 'en', 'cn'].indexOf(lang)) {
          return this.$i18n.locale = lang;
        }
      }

      this.$i18n.locale = 'en';
    },

    async loadProfile() {
      if (!Cookies.get('dolphinAntyAccessToken')) {
        location.href = '/'
      }
      try {
        const response = await this.$store.dispatch('main/loadProfile')

        if (!response.data.data.ref_stat || !response.data.data.ref_stat.users_count) {
          response.data.data.ref_stat = {};
          response.data.data.ref_stat.users_count = 0;
        }
      } catch (_) {
        // console.log(_)
        location.href = '/'
      }
    },

    copyRefLink() {
      if (this.profile === null) return;

      navigator.clipboard.writeText(`https://anty.dolphin.ru.com/a/${this.profile.id}`)
      this.snackbarLinkCopied = true;
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
  top: 1px;
}
</style>