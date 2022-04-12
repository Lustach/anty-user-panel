<template>
  <v-data-table
    id="affiliateMainTable"
    :items="transactions"
    :headers="cols"
    :loading="loading.mainTable"
    class="anty-user-panel-affiliate-main-table"
    @update:sort-desc="handleSort"
  >
    <!-- ДАТА -->
    <template #[`item.date`]="{item}">
      <span>
        {{ moment.parseZone(item.created_at).local().format("YYYY-MM-DD HH:mm:ss") }}
      </span>
    </template>

    <!-- ПОЛЬЗОВАТЕЛЬ -->
    <template #[`item.user`]="{item}">
      <span v-if="item && item.donor">
        {{ item.donor.username }}
      </span>
    </template>

    <!-- СУММА -->
    <template #[`item.sum`]="{item}">
      {{ item.currency ? showSum(item) : item.sum }}
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'AffiliateMainTable',

  data() {
    return {
      moment
    }
  },

  computed: {
    ...mapGetters({
      transactions: 'affiliate/transactions',
      loading: 'affiliate/loading',
      pagination: 'affiliate/pagination'
    }),

    cols () {
      const cols = []

      cols.push({ text: this.$t('affiliateProgram.mainTable.date'), value: 'date', width: 200 })
      cols.push({ text: this.$t('affiliateProgram.mainTable.user'), value: 'user', sortable: false })
      cols.push({ text: this.$t('affiliateProgram.mainTable.amount'), value: 'sum', width: 200, sortable: false })

      return cols
    },

    footerOptions () {
      const options = {}

      options.page = this.pagination.currentPage
      options.itemsPerPage = this.pagination.perPage

      return options
    },

    footerPagination () {
      const pagination = {}

      pagination.page = this.pagination.currentPage
      pagination.itemsPerPage = this.pagination.perPage
      pagination.pageStart = this.pagination.from - 1
      pagination.pageStop = this.pagination.to
      pagination.pageCount = this.pagination.lastPage
      pagination.itemsLength = this.pagination.total

      return pagination
    }
  },

  created() {
    const payload = {
      page: 1,
      itemsPerPage: 10,
      sort: 'desc'
    }
    this.$store.dispatch('affiliate/loadTransactions', payload)
  },

  methods: {
    handleSort(isDesc) {
      console.log(isDesc)
      const payload = {
        page: 1,
        itemsPerPage: 10,
        sort: 'desc'
      }
      if (isDesc[0] !== undefined) {
        payload.sort = isDesc[0] ? 'desc' : 'asc'
      }
      this.$store.dispatch('affiliate/loadTransactions', payload)
    },

    updateFooterOptions (options) {
      const payload = {
        sort: this.pagination.sort,
        page: options.page,
        itemsPerPage: options.itemsPerPage
      }
      this.$store.dispatch('affiliate/loadTransactions', payload)
    },

    showSum(item) {
      switch (item.currency.toUpperCase()) {
      case 'RUB':
        return item.sum.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2, minimumFractionDigits: 2 })
      case 'USD':
        return item.sum.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2 })
      }
    }
  }
}
</script>