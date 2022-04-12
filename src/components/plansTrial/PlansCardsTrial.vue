<template>
  <div>
    <div>
      <h1
        class="mb-5 text--accent-2"

        v-html="$t('plans.heading',[capitalizeFirstLetter( profile.subscription.plan)])"
      />
    </div>

    <v-row>
      <v-col
        v-for="plan in plans"
        :key="`dolphin-anty-user-panel-plan-${plan.name}`"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card
          class="user-panel-plans-card rounded-xl"
        >
          <v-card-text
            style="height: 100%;"
            class="d-flex flex-column justify-space-between"
          >
            <div>
              <div class="user-panel-plans-card-title mb-4">
                {{ plan.name }}
              </div>

              <div class="mb-4">
                {{ plan.description }}
              </div>

              <div class="mb-1">
                <span
                  style="font-size: 32px; color: #000000;"
                  class="mr-2"
                >
                  {{ plan.ammountPerMonth.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0 }) }}
                </span>
                <span
                  v-if="plan.ammountPerMonth !== 0 && $i18n.locale === 'ru'"
                  style="font-size: 24px; font-weight: 300;"
                >
                  {{ convertFromUsd(plan.ammountPerMonth, 'RUB').toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0, minimumFractionDigits: 0 }) }}
                </span>
              </div>
              <div>
                {{ $t("plans.perMonth").toLowerCase() }}
              </div>

              <v-divider class="my-4" />

              <div
                v-if="plan.name === 'Enterprise'"
                class="mb-2"
              >
                {{ $t("plans.saveUpTo") + ':' }}
                <v-autocomplete
                  v-model="profilesCountSelected"
                  :items="profilesCount"
                  dense
                  outlined
                  hide-details
                  rounded
                  class="user-panel-plans-card-profiles-count-autocomplete"
                />
              </div>
              <div
                v-else
                class="mb-2"
              >
                {{ $t("plans.saveUpTo") + " " + plan.count + " " + $t("plans.browserProfiles").toLowerCase() }}
              </div>

              <ul class="mb-4 user-panel-plans-card-features">
                <li
                  v-for="(feature, featureIndex) in plan.features"
                  :key="`dolphin-anty-user-panel-plans-feature-${featureIndex}`"
                >
                  <v-icon
                    :size="12"
                    color="primary"
                    class="mr-1"
                  >
                    fas fa-plus
                  </v-icon>{{ feature }}
                </li>
              </ul>
            </div>
            <div>
              <v-alert
                text
                style="color: rgba(0, 0, 0, 0.6);"
                rounded
              >
                <div>
                  <span
                    style="font-size: 32px; color: #000000;"
                    class="mr-2"
                  >
                    +{{ plan.ammountPerAdditional.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0 }) }}
                  </span>
                  <span
                    v-if="plan.ammountPerAdditional !== 0 && $i18n.locale === 'ru'"
                    style="font-size: 24px; font-weight: 300;"
                  >
                    +{{ convertFromUsd(plan.ammountPerAdditional, 'RUB').toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0, minimumFractionDigits: 0 }) }}
                  </span>
                </div>
                <span style="font-size: 13px;">
                  {{ plan.additional }}
                </span>
              </v-alert>

              <v-btn
                :id="`buttonTry${capitalize(plan.name)}`"
                block
                color="primary"
                rounded
                @click="selectPlan(plan.name, plan.count)"
              >
                {{ $t('plans.choosePlan') }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import convertFromUsdMixin from '@/mixins/convertFromUsd'
import {mapGetters} from "vuex";
import PLANS_PRICING from "../../constants/plans";
export default {
  name: 'PlansCardsTrial',

  mixins: [
    convertFromUsdMixin
  ],

  data() {
    return {
      profilesCountSelected: 1000
    }
  },

  computed: {
    ...mapFields('plans', ['selectedPlan']),
    ...mapGetters({
      profile: 'main/profile',
    }),
    profilesCount() {
      return [
        {
          value: 1000,
          text: `1000 ${this.$tc('plans.profilesMultiple', 1000).toLowerCase()}`
        },
        {
          value: 2000,
          text: `2000 ${this.$tc('plans.profilesMultiple', 2000).toLowerCase()}`
        },
        {
          value: 3000,
          text: `3000 ${this.$tc('plans.profilesMultiple', 3000).toLowerCase()}`
        },
        {
          value: 4000,
          text: `4000 ${this.$tc('plans.profilesMultiple', 4000).toLowerCase()}`
        },
        {
          value: 5000,
          text: `5000 ${this.$tc('plans.profilesMultiple', 5000).toLowerCase()}`
        },
        {
          value: 6000,
          text: `6000 ${this.$tc('plans.profilesMultiple', 6000).toLowerCase()}`
        },
        {
          value: 7000,
          text: `7000 ${this.$tc('plans.profilesMultiple', 7000).toLowerCase()}`
        },
        {
          value: 8000,
          text: `8000 ${this.$tc('plans.profilesMultiple', 8000).toLowerCase()}`
        },
        {
          value: 9000,
          text: `9000 ${this.$tc('plans.profilesMultiple', 9000).toLowerCase()}`
        },
        {
          value: 10000,
          text: `10000 ${this.$tc('plans.profilesMultiple', 10000).toLowerCase()}`
        },
      ]
    },
    enterprisePrice(){
      let price =  299 + ((this.profilesCountSelected.value / 1000) - 1) *   PLANS_PRICING['enterprise'].additionalThousandProfiles


      return price  ?  price : 299
    },
    plans() {
      return [
        {
          name: "Free",
          ammountPerMonth: 0,
          ammountPerAdditional: 10,
          description: this.$t('plans.free.description'),
          count: 10,
          features: [
            this.$t('plans.abilityToBuyAdditionalProfiles')
          ],
          additional: this.$t('plans.free.forEvery10AdditionalProfiles').toLowerCase()
        },
        {
          name: "Base",
          ammountPerMonth: 89,
          ammountPerAdditional: 10,
          description: this.$t('plans.base.description'),
          count: 100,
          features: [
            this.$t('plans.abilityToAddUsersToATeam')
          ],
          additional: this.$t('plans.forAdditionalTeamMember').toLowerCase()
        },
        {
          name: "Team",
          ammountPerMonth: 159,
          ammountPerAdditional: 20,
          description: this.$t('plans.team.description'),
          count: 300,
          features: [
            this.$t('plans.abilityToAddUsersToATeam')
          ],
          additional: this.$t('plans.forAdditionalTeamMember').toLowerCase()
        },
        {
          name: "Enterprise",
          ammountPerMonth: this.enterprisePrice,
          ammountPerAdditional: 25,
          description: this.$t('plans.enterprise.description'),
          count: 1000,
          features: [
            this.$t('plans.abilityToAddUsersToATeam'),
            this.$t('plans.abilityToBuyAdditionalProfiles')
          ],
          additional: this.$t('plans.forAdditionalTeamMember').toLowerCase()
        }
      ]
    }
  },

  methods: {
    selectPlan(plan, profilesCount) {
      this.selectedPlan.additionalUsers = this.profile.subscription.users.count - 1
      this.selectedPlan.plan = plan.toLowerCase()
      if (plan === 'Enterprise') {
        this.selectedPlan.profilesCount = this.profilesCountSelected
      } else {
        this.selectedPlan.profilesCount = profilesCount
      }

      this.$store.dispatch('plans/openDialog', 'mainDialogTrial')
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
};
</script>

<style scoped>
.mt--48px {
  margin-top: -48px;
}
</style>
