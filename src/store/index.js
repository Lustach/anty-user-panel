import Vuex from 'vuex'
import Vue from 'vue'

import main from './modules/main'
import plans from './modules/plans'
import affiliate from './modules/affiliate'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    main,
    plans,
    affiliate
  }
})
