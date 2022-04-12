import Vue from 'vue'
import VueRouter from 'vue-router'
// import Registration from '../views/Registration.vue'
// import Home from '../views/Home.vue'
import Overview from '../views/Overview.vue'
import Affiliate from '../views/Affiliate.vue'
import Plans from '../views/Plans.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'Overview' }
  },
  {
    path: '/overview',
    name: 'Overview',
    component: Overview
  },
  {
    path: '/affiliate-program',
    name: 'Affiliate',
    component: Affiliate
  },
  {
    path: '/payment',
    name: 'Plans',
    component: Plans
  },
  // {
  //   path: '/registration',
  //   name: 'Registration',
  //   component: Registration
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
