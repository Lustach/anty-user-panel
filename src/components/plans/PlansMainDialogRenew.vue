<template>
  <v-dialog
    :value="dialogs.mainDialog"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
  >
    <v-card class="rounded-xl">
      <!-- ЗАГОЛОВОК ДИАЛОГА -->
      <v-card-title class="d-flex flex-column align-start mb-4">
        <div style="font-size: 28px;">
          {{ modeRenew ? $t('plans.youProlongPlan') : $t('plans.youHaveSelected') }}
        </div>
        <div style="font-size: 28px; color: #B645EE;">
          {{ capitalize(selectedPlan.plan) }}
        </div>
      </v-card-title>
      <!-- ЗАГОЛОВОК ДИАЛОГА КОНЕЦ -->

      <v-card-text>
        <v-row>
          <!-- АККАУНТ -->
          <v-col cols="5">
            {{ $t("common.account") }}
          </v-col>
          <v-col
            cols="7"
            class="text-end"
          >
            {{ profile.username }}
          </v-col>
          <!-- АККАУНТ КОНЕЦ -->
          <div class="custom-divider" />

          <!-- КОЛИЧЕСТВО ПРОФИЛЕЙ -->
          <v-col cols="5">
            {{ $t("plans.profilesCount") }}
          </v-col>
          <v-col
            cols="7"
            class="text-end"
          >
            {{ selectedPlan.profilesCount }}
          </v-col>
          <!-- КОЛИЧЕСТВО ПРОФИЛЕЙ КОНЕЦ -->

          <div
            v-if="selectedPlan.plan === 'free'"
            class="custom-divider"
          />


          <!-- ДОП. ПОЛЬЗОВАТЕЛИ КОНЕЦ -->

          <div class="custom-divider" />

          <!-- ПРОДЛИТЬ ДО -->
          <v-col cols="5">
            <div
              style="height: 100%;"
              class="d-flex align-center"
            >
              {{ $t("plans.prolongMonths.prolongMonths") }}
            </div>
          </v-col>
          <v-col
            cols="7"
            class="text-end"
          >
            <select
              v-model="selectedPlan.prolongMonths"
              class="custom-input custom-input-select"
              @change="changeMonth($event.target.value)"
            >
              <option
                v-for="prolongMonth in prolongMonths"
                :key="`dolphin-anty-user-panel-plan-dialog-${prolongMonth.text}`"
                :value="parseInt(prolongMonth.value, 10)"
              >
                {{ prolongMonth.text }}
              </option>
            </select>
          </v-col>
          <!-- ПРОДЛИТЬ ДО КОНЕЦ -->

          <div class="custom-divider" />

          <!-- ПРОМОКОД -->
          <v-col
            v-if="profile && profile.team && parseInt(profile.team.usedPromo, 10) === 0"
            cols="5"
          >
            <div
              style="height: 100%;"
              class="d-flex align-center"
            >
              {{ $t("plans.promocode") }}
            </div>
          </v-col>
          <v-col
            v-if="profile && profile.team && parseInt(profile.team.usedPromo, 10) === 0"
            cols="7"
            class="text-end"
          >
            <input
              v-model="selectedPlan.promocode"
              :placeholder="$t('plans.promocode')"
              spellcheck="false"
              class="custom-input"
              :disabled="selectedPlan.disablePromocode"
              @input="handlePromocodeInput($event.target.value)"
            >
          </v-col>
          <!-- ПРОМОКОД КОНЕЦ -->

          <div
            v-if="profile && profile.team && parseInt(profile.team.usedPromo, 10) === 0"
            class="custom-divider"
          />

          <!-- ДИСКОНТ -->
          <v-col cols="5">
            {{ $t("plans.discount") }}
          </v-col>
          <v-col
            cols="7"
            class="text-end"
          >
            <span id="discountAmount">{{ selectedPlan.discount }}%</span>
          </v-col>
          <!-- ДИСКОНТ КОНЕЦ -->

          <div class="custom-divider" />

          <!-- К ОПЛАТЕ -->
          <v-col
            cols="6"
            style="font-weight: bold; font-size: 18px; cursor: pointer;"
            @click="showFullEstimate = !showFullEstimate"
          >
            <v-btn
              icon
              x-small
            >
              <v-icon :size="14">
                {{ showFullEstimate ? 'fas fa-chevron-down' : 'fas fa-chevron-right' }}
              </v-icon>
            </v-btn>
            {{ $t("plans.youWillBeCharged") }}
          </v-col>
          <v-col
            cols="6"
            class="text-end"
            style="font-size: 18px; font-weight: bold; cursor: pointer;"
            @click="showFullEstimate = !showFullEstimate"
          >
            {{ parseFloat(estimate).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2}) }}
          </v-col>
          <!-- К ОПЛАТЕ КОНЕЦ -->

          <!-- ОПИСАНИЕ СУММЫ -->
          <v-col
            v-if="showFullEstimate"
            cols="12"
          >
            <v-row>
              <!-- БАЗОВАЯ СТОИМОСТЬ ТАРИФА -->
              <v-col
                cols="8"
                class="py-1"
              >
                {{ $t('plans.amountDescription.planBasePrice') }}
              </v-col>
              <v-col
                cols="4"
                class="text-end py-1"
              >
                {{
                  parseFloat(estimateDetailsPlanBasePrice).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2})
                }}
              </v-col>
              <!-- БАЗОВАЯ СТОИМОСТЬ ТАРИФА КОНЕЦ -->

              <!-- СТОИМОСТЬ ДОП. ЮЗЕРОВ -->
              <v-col
                v-if="selectedPlan.plan !== 'free' && estimateDetailsAdditionalUsersPrice > 0"
                cols="8"
                class="py-1"
              >
                {{ $t('plans.amountDescription.priceForAdditionalUsers') }}, {{ selectedPlan.additionalUsers }} {{ $t('plans.piece') }}
              </v-col>
              <v-col
                v-if="selectedPlan.plan !== 'free' && estimateDetailsAdditionalUsersPrice > 0"
                cols="4"
                class="text-end py-1"
              >
                {{
                  parseFloat(estimateDetailsAdditionalUsersPrice).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2})
                }}
              </v-col>
              <!-- СТОИМОСТЬ ДОП. ЮЗЕРОВ КОНЕЦ -->

              <!-- СТОИМОСТЬ ДОП. ПРОФИЛЕЙ -->
              <v-col
                v-if="selectedPlan.plan === 'enterprise' && (selectedPlan.profilesCount - 1000) > 0"
                cols="8"
                class="py-1"
              >
                {{ $t('plans.amountDescription.priceForAdditionalProfiles') }}, {{ selectedPlan.profilesCount - 1000 }} {{ $t('plans.piece') }}
              </v-col>
              <v-col
                v-if="selectedPlan.plan === 'enterprise' && (selectedPlan.profilesCount - 1000) > 0"
                cols="4"
                class="text-end py-1"
              >
                {{
                  parseFloat(estimateDetailsAdditionalProfilesPrice).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2})
                }}
              </v-col>

              <v-col
                v-if="selectedPlan.plan === 'free'"
                cols="8"
                class="py-1"
              >
                {{ $t('plans.amountDescription.priceForAdditionalProfiles') }}, {{ selectedPlan.additionalProfiles }} {{ $t('plans.piece') }}
              </v-col>
              <v-col
                v-if="selectedPlan.plan === 'free'"
                cols="4"
                class="text-end py-1"
              >
                {{
                  parseFloat(estimateDetailsAdditionalProfilesPrice).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2})
                }}
              </v-col>
              <!-- СТОИМОСТЬ ДОП. ПРОФИЛЕЙ КОНЕЦ -->

              <!-- СКИДКА -->
              <v-col
                v-if="estimateDetailsDiscount > 0"
                cols="8"
                class="py-1"
              >
                {{ $t('plans.discount') }}
              </v-col>
              <v-col
                v-if="estimateDetailsDiscount > 0"
                cols="4"
                class="text-end py-1"
              >
                -{{
                  parseFloat(estimateDetailsDiscount).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2})
                }}
              </v-col>
              <!-- СКИДКА КОНЕЦ -->

              <!-- КОМИССИЯ ПЛАТЕЖНОЙ СИСТЕМЫ -->
              <v-col
                cols="8"
                class="py-1"
              >
                {{ $t('plans.amountDescription.paymentSystemFee') }}
                <span v-if="selectedPlan.paymentMethod==='usdt'">0%</span>
                <span v-if="selectedPlan.paymentMethod==='capitalist'">5%</span>
                <span v-if="selectedPlan.paymentMethod==='crypto'">5%</span>
                <span v-if="selectedPlan.paymentMethod==='card'">3%</span>
              </v-col>
              <v-col
                cols="4"
                class="text-end py-1"
              >
                {{
                  parseFloat(estimateDetailsPaymentSystemFee).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2})
                }}
              </v-col>
              <!-- КОМИССИЯ ПЛАТЕЖНОЙ СИСТЕМЫ КОНЕЦ -->
            </v-row>
          </v-col>

          <!-- МЕТОД ОПЛАТЫ -->
          <v-col
            cols="12"
            class="text-center"
          >
            <v-btn-toggle
              v-model="selectedPlan.paymentMethod"
              mandatory
              dense
            >
              <v-btn
                v-for="paymentMethod in paymentsMethods"
                :key="`user-panel-plans-payment-method-${paymentMethod}`"
                :value="paymentMethod"
                color="primary"
                outlined
                :disabled="['ewallet', 'paypal'].includes(paymentMethod) ? true : false"
              >
                {{ $t(`plans.${paymentMethod}`) }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <!-- МЕТОД ОПЛАТЫ КОНЕЦ -->

          <!-- ВЫВОД ОШИБОК -->
          <v-col
            v-if="error.show"
            cols="12"
          >
            <v-alert
              color="error"
              text
              class="mb-0"
            >
              {{ error.message }}
            </v-alert>
          </v-col>
          <!-- ВЫВОД ОШИБОК КОНЕЦ -->

          <!-- ОПЛАТИТЬ -->
          <v-col
            cols="12"
            class="text-center"
          >
            <div
              v-if="selectedPlan.paymentMethod == 'card'"
              class="card-info"
              v-html="$t('plans.cardInfo')"
            />
            <v-btn
              color="primary"
              rounded
              class="mb-2"
              :loading="payNowLoading"
              :disabled="parseInt(estimate, 10) === 0"
              @click="pay"
            >
              {{ $t('common.payNow') }}
            </v-btn>
            <DialogManualPaymentInfo
              v-if="selectedPlan.paymentMethod==='capitalist'"
              :sum="estimate ? parseFloat(estimate).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              }) : 0"
            />
            <DialogManualPaymentInfoUSDT
              v-if="selectedPlan.paymentMethod==='usdt'"
              :sum="estimate ? parseFloat(estimate ).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              }) : 0"
            />

            <!-- ВАРНИНГИ АВТОМАТИЧЕСКОГО ПРОДЛЕНИЯ ПРИ ОПЛАТЕ КАРТОЙ -->
            <div
              v-if="selectedPlan.paymentMethod === 'card'"
            >
              <v-icon :size="12">
                fas fa-check
              </v-icon>
              {{ $t('plans.yourSubscriptionWillAutomaticallyRenew') }} {{ subscriptionRenewDate }}
            </div>
            <div v-if="selectedPlan.paymentMethod === 'card'">
              <v-icon :size="12">
                fas fa-check
              </v-icon>
              {{ $t('plans.youCanCancelAnyTimeBeforeThisDate') }}
            </div>
            <!-- ВАРНИНГИ АВТОМАТИЧЕСКОГО ПРОДЛЕНИЯ ПРИ ОПЛАТЕ КАРТОЙ КОНЕЦ -->

            <v-alert
              v-if="selectedPlan.paymentMethod === 'crypto'"
              type="warning"
              text
              class="mb-0 py-2"
              style="font-size: 12px;"
            >
              {{ $t('plans.coinbaseWarning') }}
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- ДЕЙСТВИЯ ДИАЛОГА -->
      <v-card-actions class="justify-end">
        <v-btn
          rounded
          text
          color="grey"
          @click="closeDialog"
        >
          {{ $t('common.close') }}
        </v-btn>
      </v-card-actions>
      <!-- ДЕЙСТВИЯ ДИАЛОГА КОНЕЦ -->
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
import {mapFields} from 'vuex-map-fields'
import calculationsMixin from '../../mixins/calculations';
import PLANS_PRICING from '../../constants/plans'
import moment from 'moment'
import setPaymentsMethodsMixin from '@/mixins/setPaymentsMethods.js'
import DialogManualPaymentInfo from "@/components/dialogs/DialogManualPaymentInfo";
import DialogManualPaymentInfoUSDT from "@/components/dialogs/DialogManualPaymentInfoUSDT";

export default {
  name: 'PlansMainDialogRenew',

  components:{
    DialogManualPaymentInfo,
    DialogManualPaymentInfoUSDT
  },

  mixins: [
    calculationsMixin, setPaymentsMethodsMixin
  ],
  props: {
    modeRenew: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      moment,
      PLANS_PRICING,
      showFullEstimate: false,
      promocodeInput: '',
      estimate: 0,
      payNowLoading: false,
      error: {
        show: false,
        message: ''
      },
      coinbaseInterval: 0
    }
  },


  computed: {
    ...mapGetters({
      profile: 'main/profile',
      dialogs: 'plans/dialogs',
      statePromocode: 'plans/promocode'
    }),
    ...mapFields('plans', ['selectedPlan']),
    ...mapFields('main', ['successfulPaymentAlert']),

    subscriptionRenewDate() {
      const prolongDays = this.selectedPlan.prolongMonths * 30
      return this.moment(this.profile.subscription.expiration).add(parseInt(prolongDays, 10), 'days').locale(this.$i18n.locale).format("Do MMM YYYY")
    },

    prolongMonths() {
      const prolongMonths = []

      for (let i = 1; i <= 12; i++) {
        let text = `${i} ${this.$tc('plans.prolongMonths.months', i).toLowerCase()}`
        if (i >= 6 && i < 12) {
          text = `${i} ${this.$tc('plans.prolongMonths.months', i).toLowerCase()} -20%`
        } else if (i === 12) {
          text = `${i} ${this.$tc('plans.prolongMonths.months', i).toLowerCase()} -40%`
        }
        prolongMonths.push({
          value: i,
          text: text
        })
      }

      return prolongMonths
    },
    additionalProfiles() {
      return [
        {
          value: 0,
          text: `0 ${this.$tc('plans.profilesMultiple', 0).toLowerCase()}`
        },
        {
          value: 10,
          text: `10 ${this.$tc('plans.profilesMultiple', 10).toLowerCase()}`
        },
        {
          value: 20,
          text: `20 ${this.$tc('plans.profilesMultiple', 20).toLowerCase()}`
        },
        {
          value: 30,
          text: `30 ${this.$tc('plans.profilesMultiple', 30).toLowerCase()}`
        },
        {
          value: 40,
          text: `40 ${this.$tc('plans.profilesMultiple', 40).toLowerCase()}`
        },
        {
          value: 50,
          text: `50 ${this.$tc('plans.profilesMultiple', 50).toLowerCase()}`
        },
      ]
    },

    estimateDetailsPlanBasePrice() {
      if (!this.selectedPlan.plan) return 0;
      const plan = this.selectedPlan.plan;
      const prolongMonths = parseInt(this.selectedPlan.prolongMonths || 1, 10);

      return this.PLANS_PRICING[plan].price * prolongMonths
    },

    estimateDetailsAdditionalUsersPrice() {
      if (!this.selectedPlan.plan) return 0;
      const plan = this.selectedPlan.plan;
      const additionalUsers = parseInt(this.selectedPlan.additionalUsers || 0, 10);
      const prolongMonths = parseInt(this.selectedPlan.prolongMonths || 1, 10);

      return additionalUsers * this.PLANS_PRICING[plan].additionalUser * prolongMonths
    },

    estimateDetailsAdditionalProfilesPrice() {
      if (!this.selectedPlan.plan) return 0;
      const plan = this.selectedPlan.plan;
      const profilesCount = parseInt(this.selectedPlan.profilesCount || 0, 10)
      const additionalProfiles = parseInt(this.selectedPlan.additionalProfiles || 0, 10);
      const prolongMonths = parseInt(this.selectedPlan.prolongMonths || 1, 10);

      if (['base', 'team'].includes(plan)) return 0

      // [for free] additional ten profiles
      if (['free'].indexOf(plan) > -1) {
        return Math.ceil(additionalProfiles / 10) * this.PLANS_PRICING[plan].additionalTenProfiles * prolongMonths
      }

      // [for enterprice] additional thousand profiles
      return Math.ceil((profilesCount - 1000) / 1000) * this.PLANS_PRICING[plan].additionalThousandProfiles * prolongMonths
    },

    estimateDetailsDiscount() {
      if (!this.selectedPlan.plan) return 0;
      const discount = parseInt(this.selectedPlan.discount || 0, 10);
      if (discount <= 0) return 0

      const plan = this.selectedPlan.plan;
      const prolongMonths = parseInt(this.selectedPlan.prolongMonths || 1, 10);
      const profilesCount = parseInt(this.selectedPlan.profilesCount || 0, 10)
      const additionalUsers = parseInt(this.selectedPlan.additionalUsers || 0, 10);
      const additionalProfiles = parseInt(this.selectedPlan.additionalProfiles || 0, 10);

      let additionalUsersCost = 0;
      let additionalProfileCost = 0;

      const planPrice = PLANS_PRICING[plan].price

      // [for free] additional ten profiles
      if (['free'].indexOf(plan) > -1) {
        additionalProfileCost = Math.ceil(additionalProfiles / 10) * PLANS_PRICING[plan].additionalTenProfiles
      }

      // [for enterprice] additional thousand profiles
      if (['enterprise'].indexOf(plan) > -1) {
        additionalProfileCost = Math.ceil((profilesCount - 1000) / 1000) * PLANS_PRICING[plan].additionalThousandProfiles
      }

      // additional users
      if (['base', 'team', 'enterprise'].indexOf(plan) > -1) {
        // calculate
        additionalUsersCost = additionalUsers * PLANS_PRICING[plan].additionalUser
      }

      let total = (planPrice + additionalUsersCost + additionalProfileCost) * prolongMonths

      return total * (discount / 100)
    },

    estimateDetailsPaymentSystemFee() {
      if (!this.selectedPlan.plan) return 0;

      let fee = 0
      const plan = this.selectedPlan.plan;
      const prolongMonths = parseInt(this.selectedPlan.prolongMonths || 1, 10);
      const profilesCount = parseInt(this.selectedPlan.profilesCount || 0, 10)
      const additionalUsers = parseInt(this.selectedPlan.additionalUsers || 0, 10);
      const additionalProfiles = parseInt(this.selectedPlan.additionalProfiles || 0, 10);
      const discount = parseInt(this.selectedPlan.discount || 0, 10);
      const paymentMethod = this.selectedPlan.paymentMethod;

      let additionalUsersCost = 0;
      let additionalProfileCost = 0;

      const planPrice = PLANS_PRICING[plan].price

      // [for free] additional ten profiles
      if (['free'].indexOf(plan) > -1) {
        additionalProfileCost = Math.ceil(additionalProfiles / 10) * PLANS_PRICING[plan].additionalTenProfiles
      }

      // [for enterprice] additional thousand profiles
      if (['enterprise'].indexOf(plan) > -1) {
        additionalProfileCost = Math.ceil((profilesCount - 1000) / 1000) * PLANS_PRICING[plan].additionalThousandProfiles
      }

      // additional users
      if (['base', 'team', 'enterprise'].indexOf(plan) > -1) {
        // calculate
        additionalUsersCost = additionalUsers * PLANS_PRICING[plan].additionalUser
      }

      let total = (planPrice + additionalUsersCost + additionalProfileCost) * prolongMonths
      if (discount > 0) {
        total = total - total * (discount / 100)
      }

      switch (paymentMethod) {
      case 'card':
        fee = total * 0.03
        break;
      case 'crypto':
        fee = total * 0.05
        break;
      case 'capitalist':
        fee = total * 0.05
        break;
      }

      return fee
    }
  },


  // Launch calcucation every time on `selectedPlan` change
  watch: {
    'selectedPlan': {
      deep: true,
      handler() {
        this.simpleEstimateCalculation();
      }
    },
    'statePromocode': {
      deep: true,
      handler(newVal) {
        if (newVal.discount > 0) {
          const months = parseInt(this.selectedPlan.prolongMonths, 10)
          if (months >= 6 && months < 12 && newVal.discount < 20) {
            this.selectedPlan.discount = 20
          } else if (months === 12 && newVal.discount < 40) {
            this.selectedPlan.discount = 40
          }
        }
      }
    }
  },

  created() {
    this.$set(this.error, 'show', false)
    this.$set(this.error, 'message', '')
    // this.selectedPlan.additionalUsers = this.profile.subscription.users.limit
    this.simpleEstimateCalculation();
    this.api.get('/subscription/renew').then(res => {
      const data = res.data.data
      this.selectedPlan.prolongMonths = data.days / 30
      this.selectedPlan.promocode = data.promo.name
    })
  },

  destroyed() {
    clearInterval(this.coinbaseInterval)
  },

  methods: {
    closeDialog() {
      this.$store.dispatch('plans/closeDialog', 'mainDialog')
    },

    capitalize(string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    },

    async pay() {
      if (this.selectedPlan.paymentMethod === 'capitalist'){
        this.$store.dispatch('main/openDialog', 'manualPaymentInfoDialog')
        return;
      }
      if (this.selectedPlan.paymentMethod === 'usdt'){
        this.$store.dispatch('main/openDialog', 'manualPaymentInfoDialogUSDT')
        return;
      }

      try {
        this.payNowLoading = true
        this.$set(this.error, 'show', false)
        this.$set(this.error, 'message', '')
        const response = await this.$store.dispatch('plans/createPaymentInvoice')
        if (response.status === 200 &&
            response.data &&
            response.data.data &&
            response.data.data.invoiceId &&
            response.data.data.currency
        ) {
          console.log('Invoice id:', response.data.data.invoiceId)

          switch (this.selectedPlan.paymentMethod) {
          case 'card':
            this.openCloudPaymentsWidget(response.data.data.invoiceId.toString(), response.data.data.sum, response.data.data.currency)
            break;
          case 'crypto':
            this.successfulPaymentAlert = false
            window.open(response.data.data.paymentUrl, '_blank');
            this.coinbaseInterval = setInterval(async () => {
              const coinbaseResponse = await this.api(`/subscription/invoices/${response.data.data.invoiceId}`)
              if (coinbaseResponse.data.status === 'success') {
                clearInterval(this.coinbaseInterval)
                this.closeDialog()
                this.$store.dispatch('main/loadProfile')
                this.$router.push({name: 'Overview'})
                this.successfulPaymentAlert = true
              }
            }, 15000)
            break;
          }
        } else {
          throw response
        }
      } catch (error) {
        console.log(error)
        const err = error.response
        if (err.status === '500') {
          this.$set(this.error, 'show', true)
          this.$set(this.error, 'message', this.$t('plans.errors.somethingWentWrong'))
        } else if (err.data && err.data.error && err.data.error.code) {
          this.$set(this.error, 'show', true)
          this.$set(this.error, 'message', this.$t(`plans.errors.${err.data.error.code}`))
        }
      } finally {
        this.payNowLoading = false
      }
    },

    openCloudPaymentsWidget(invoiceId, amount, currency) {
      const _this = this
      _this.successfulPaymentAlert = false

      const widget = new window.cp.CloudPayments({
        language: this.$i18n.locale === 'ru' ? 'ru-RU' : 'en-US'
      });

      widget.charge(
        { //options
          publicId: 'pk_35d0ec71cbc8db16b7229ab09c6bb', //id из личного кабинета
          description: this.$t('plans.paymentFor'), //назначение
          amount: parseFloat(amount), //сумма
          // amount: parseInt(this.estimate, 10), //сумма
          currency: currency.toUpperCase(), //валюта
          accountId: this.profile.username, //идентификатор плательщика (необязательно)
          invoiceId: invoiceId, //номер заказа  (необязательно)
          skin: "mini", //дизайн виджета (необязательно)
          data: {
            cloudPayments: {
              recurrent: {
                interval: "Day",
                period: 30 * parseInt(this.selectedPlan.prolongMonths, 10),
              }
            }
          }
        },
        function (options) {
          console.log(options)
          _this.closeDialog()
          _this.$store.dispatch('main/loadProfile')
          _this.$router.push({name: 'Overview'})
          _this.successfulPaymentAlert = true
        }
      )
    },

    handlePromocodeInput(value) {
      this.promocodeInput = value
      setTimeout(async () => {
        if (value === this.promocodeInput) {
          if (value === '') {
            this.$store.dispatch('plans/setPromocode', {isSet: false, discount: 0})
            this.changeMonth(this.selectedPlan.prolongMonths)

            if (
              this.profile.team &&
                this.profile.team.created_at &&
                this.moment(this.profile.team.created_at).unix() <= 1631728799 &&
                !this.profile.team.hadTransactions
            ) {
              if (this.selectedPlan.discount === '0' || parseInt(this.selectedPlan.discount, 10) < 20) {
                this.selectedPlan.discount = '20'
              }
            } else {
              this.selectedPlan.discount = 0
            }
            return
          }

          this.$store.dispatch('plans/sendPromocode', value)
        }
      }, 500)
    },

    changeMonth(value) {
      // if (this.statePromocode.isSet && this.statePromocode.discount === 0) return;

      const prolongMonths = parseInt(value || 1, 10);

      if (this.profile.team && this.profile.team.promoDiscount) {
        if (prolongMonths >= 6 && prolongMonths < 12 && this.profile.team.promoDiscount <= 20) {
          this.selectedPlan.discount = 20
        } else if (prolongMonths === 12 && this.profile.team.promoDiscount <= 40) {
          this.selectedPlan.discount = 40
        } else {
          if (this.profile.team.promo && this.profile.team.promo.trim() && parseInt(this.profile.team.usedPromo, 10) === 0) {
            this.selectedPlan.promocode = this.profile.team.promo
            this.selectedPlan.discount = this.profile.team.promoDiscount
            this.selectedPlan.disablePromocode = true
          } else if (this.profile.team.promo && this.profile.team.promo.trim() && parseInt(this.profile.team.usedPromo, 10) === 1) {
            this.selectedPlan.promocode = ''
            this.selectedPlan.discount = '0'
            this.selectedPlan.disablePromocode = false
          }
        }
      } else if (
        this.profile.team &&
          this.profile.team.created_at &&
          this.moment(this.profile.team.created_at).unix() <= 1631728799 &&
          !this.profile.team.hadTransactions
      ) {
        if (prolongMonths === 12) {
          this.selectedPlan.discount = 40
        } else {
          this.selectedPlan.discount = 20
        }
      } else {
        if (prolongMonths >= 6 && prolongMonths < 12) {
          this.selectedPlan.discount = 20
        } else if (prolongMonths === 12) {
          this.selectedPlan.discount = 40
        } else {
          this.selectedPlan.discount = 0
        }
      }
    },

    changeAdditionalUsers(e) {
      if (e.target.value === '' || e.target.value < 0) {
        this.selectedPlan.additionalUsers = 0
      }
    }
  }
}
</script>

<style scoped>
.custom-input {
  border: 1px solid #9E9E9E;
  border-radius: 4px;
  padding: 2px 4px;
}

.custom-input-select {
  -webkit-appearance: auto;
  -moz-appearance: auto;
  appearance: auto;
  cursor: pointer;
}
</style>
