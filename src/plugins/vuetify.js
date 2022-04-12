import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#B645EE",
        secondary: "#03A9F4"
      },
      dark: {
        primary: "#B645EE",
        secondary: "#03A9F4"
      },
    },
  },
});
