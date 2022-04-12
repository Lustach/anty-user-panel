<template>
  <v-card
    elevation="0"
    style="width: 100%;"
  >
    <v-card-title
      class="pt-0"
      style="height: 52px;"
    >
      {{ $t('affiliateProgram.affiliateProgram') }}
    </v-card-title>
    <v-card-text>
      <v-alert
        style="background-color: rgba(0, 0, 0, 0.06);"
        v-html="$t('affiliateProgram.affiliateCondition')"
      >
        <!-- {{ $t('affiliateProgram.affiliateCondition') }} -->
      </v-alert>
      <v-text-field 
        v-if="profile && 'id' in profile"
        :label="$t('home.referalLink')"
        filled
        readonly
        full-width
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

      <v-row>
        <!-- ЗАРЕГИСТРИРОВАНО ПОЛЬЗОВАТЕЛЕЙ -->
        <v-col
          v-if="profile && 'ref_stat' in profile && 'users_count' in profile.ref_stat"
          cols="4"
        >
          {{ $t("ref.registeredUsers") }}
        </v-col>
        <v-col
          v-if="profile && 'ref_stat' in profile && 'users_count' in profile.ref_stat"
          cols="8"
          class="text-end"
        >
          {{ profile.ref_stat.users_count }}
        </v-col>

        <div class="custom-divider" />

        <!-- БАЛАНС -->
        <v-col
          v-if="profile && profile.ref_stat && profile.ref_stat.balance !== undefined"
          cols="4"
        >
          {{ $t("affiliateProgram.balance") }}
        </v-col>
        <v-col
          v-if="profile && profile.ref_stat && profile.ref_stat.balance !== undefined"
          cols="8"
          class="text-end"
        >
          {{ profile.ref_stat.balance.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2, minimumFractionDigits: 2 }) }}
        </v-col>

        <div class="custom-divider" />

        <v-col cols="12">
          <div
            style="font-size: 18px; font-weight: bold;"
            class="mt-3"
          >
            {{ $t('affiliateProgram.mainTable.transactions') }}
          </div>
          <main-table />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import MainTable from '@/components/affiliate/AffiliateMainTable.vue'

export default {
  name: 'Affiliate',

  components: {
    MainTable
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile'
    })
  },

  methods: {
    copyRefLink() {
      if (this.profile === null) return;

      navigator.clipboard.writeText(`https://anty.dolphin.ru.com/a/${this.profile.id}`)
      this.$store.dispatch('main/alert', {
        color: 'success',
        message: this.$t('common.copied')
      })
    }
  }
}
</script>