<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    <!-- PASSWORD COPIED ALERT -->
    <v-snackbar
      v-model="snackbars.passwordGeneration"
      :timeout="5000"
    >
      {{ $t('registration.passwordGeneratedAndCopied') }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbars.passwordGeneration = false"
        >
          {{ $t('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>

    <!-- ERROR -->
    <v-snackbar
      v-model="snackbars.error.show"
      color="error"
      :timeout="5000"
    >
      {{ snackbars.error.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbars.error.show = false"
        >
          {{ $t('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>

    <v-card
      class="mx-auto elevation-6"
      color="#B645EE"
      dark
      max-width="400"
      style="width: 90%;"
    >
      <v-card-title>
        <img
          src="logo.png"
          style="height: 30px; width: auto;"
        >
      </v-card-title>

      <v-card-text class="text-h5 font-weight-bold">
        <!-- EMAIL -->
        <v-row>
          <v-col>
            <v-text-field
              v-model="formData.username"
              :label="$t('registration.email')"
              prepend-inner-icon="fas fa-at"
              filled
              hide-details
              spellcheck="false"
            />
          </v-col>
        </v-row>

        <!-- PASSWORD -->
        <v-row>
          <v-col>
            <v-text-field
              v-model="formData.password"
              name="username"
              :label="$t('registration.password')"
              prepend-inner-icon="fas fa-lock"
              filled
              :type="showPassword ? 'text' : 'password'"
              spellcheck="false"
              :hint="$t('registration.min5Chars')"
              hide-details="auto"
            >
              <template #append>
                <!-- GENERATE PASSWORD -->
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                     
                      icon
                      x-small
                      class="mr-2"
                      v-on="on"
                      @click="generatePassword"
                    >
                      <v-icon style="font-size: 16px;">
                        fas fa-key
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('registration.passwordGenerate') }}</span>
                </v-tooltip>

                <!-- SHOW PASSWORD -->
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn 
                      icon
                      x-small
                      class="mr-2"
                      v-on="on"
                      @click="showPassword = !showPassword"
                    >
                      <v-icon style="font-size: 16px;">
                        {{ showPassword ? 'fas fa-eye-slash' : 'fas fa-eye' }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('registration.passwordShow') }}</span>
                </v-tooltip>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- PASSWORD REPEAT -->
        <v-row>
          <v-col>
            <v-text-field
              v-model="formData.passwordRepeat"
              name="password"
              :label="$t('registration.passwordRepeat')"
              prepend-inner-icon="fas fa-unlock"
              filled
              hide-details
              :type="showPassword ? 'text' : 'password'"
              spellcheck="false"
            >
              <template #append>
                <!-- SHOW PASSWORD -->
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn 
                      icon
                      x-small
                      class="mr-2"
                      v-on="on"
                      @click="showPassword = !showPassword"
                    >
                      <v-icon style="font-size: 16px;">
                        {{ showPassword ? 'fas fa-eye-slash' : 'fas fa-eye' }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('registration.passwordShow') }}</span>
                </v-tooltip>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- TELEGRAM -->
        <v-row>
          <v-col>
            <v-text-field
              label="Telegram"
              prepend-inner-icon="fab fa-telegram-plane"
              filled
              hide-details
              spellcheck="false"
            />
          </v-col>
        </v-row>

        <!-- PROMOCODE -->
        <v-row>
          <v-col>
            <v-text-field
              v-model="formData.promo"
              :label="$t('registration.promocode')"
              prepend-inner-icon="fas fa-percent"
              filled
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <div
          style="display: flex; justify-content: center; width: 100%"
          class="mb-1"
        >
          <v-btn
            :disabled="registerButtonDisabled"
            text
            color="white"
            :loading="loading"
            @click="register"
          >
            <v-icon>mdi-arrow_forward</v-icon>
            {{ $t('registration.signUp') }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'Registration',
  data() {
    return {
      loading: false,
      snackbars: {
        passwordGeneration: false,
        error: {
          show: false,
          text: null,
        }
      },
      showPassword: false,
      formData: {
        username: null,
        password: null,
        passwordRepeat: null,
        telegram: null,
        promo: null
      }
    }
  },

  computed: {
    registerButtonDisabled() {
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return !(
        this.formData.username !== null
        && this.formData.password !== null
        && this.formData.passwordRepeat !== null
        && this.formData.username.toString().length > 0
        && this.formData.password.toString().length >= 5
        && this.formData.passwordRepeat.toString().length >= 5
        && this.formData.password === this.formData.passwordRepeat
        && this.formData.username.toString().search(emailRegex) > -1
      )
    }
  },

  methods: {
    generatePassword() {
      const length = 10
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let newPassword = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        newPassword += charset.charAt(Math.floor(Math.random() * n));
      }
      navigator.clipboard.writeText(newPassword)
      this.$set(this.formData, 'password', newPassword)
      this.$set(this.formData, 'passwordRepeat', newPassword)
      this.$set(this.snackbars, 'passwordGeneration', true)
      this.showPassword = true;
    },

    async register() {
      this.loading = true;
      this.$set(this.snackbars, 'passwordGeneration', false)
      
      try {
        const response = await this.api.post('/auth/register', {
          username: this.formData.username,
          password: this.formData.password,
          telegram: (this.formData.telegram !== null && this.formData.telegram.toString().length > 0) 
            ? this.formData.telegram 
            : undefined,
          promo: (this.formData.promo !== null && this.formData.promo.toString().length > 0) 
            ? this.formData.promo 
            : undefined,
          ref: Cookies.get('a') ? Cookies.get('a') : undefined
        })

        localStorage.setItem('dolphinAntyAccessToken', response.data.token);
        this.api.defaults.headers.Authorization = `Bearer ${response.data.token}`
        this.loading = false;
        this.$router.push({path: '/'});
      } catch (err) {
        if (err.response.status === 422) {
          if (
            err.response.data
            && 'username' in err.response.data
            && Array.isArray(err.response.data.username)
            && err.response.data.username[0] === 'The username has already been taken.'
          ) {
            this.$set(this.snackbars, 'error', {show: true, text: this.$t('registration.errors.usernameHasAlreadyBeenTaken')})
          } else if(
            err.response.data
            && 'error' in err.response.data
            && err.response.data.error === 'Promo code not found'
          ) {
            this.$set(this.snackbars, 'error', {show: true, text: this.$t('registration.errors.promocodeNotFound')})
          } else {
            this.$set(this.snackbars, 'error', {show: true, text: this.$t('registration.errors.somethingWentWrong')})
          }
        }
      }

      this.loading = false;
    }
  }
}
</script>

<style>
.v-input__icon--prepend-inner i {
  font-size: 18px !important;
  margin-right: 4px;
  position: relative;
  top: -2px;
}

label {
  font-weight: 300 !important;
}
</style>