<template>
  <v-container>
    <v-row>
      <v-col>
        <!-- ССЫЛКА НАЗАД -->
        <v-btn
          text
          color="secondary"
          @click="$router.push({name: 'Overview'})"
        >
          <v-icon
            :size="16"
            class="mr-1"
          >
            mdi-arrow-left
          </v-icon>
          {{ $t('common.back') }}
        </v-btn>
      </v-col>
    </v-row>
    <!-- КАРТОЧКИ -->

    <plans-cards v-if="profile && profile.subscription.plan !== 'trial'" />
    <plans-cards-trial v-else />

    <!-- ДИАЛОГИ -->
    <plans-main-dialog v-if="dialogs.mainDialog" />
    <plans-main-dialog-trial v-if="dialogs.mainDialogTrial" />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import PlansMainDialog from "@/components/plans/PlansMainDialog.vue"
import PlansCards from "@/components/plans/PlansCards.vue"
import PlansCardsTrial from "../components/plansTrial/PlansCardsTrial";
import PlansMainDialogTrial from "../components/plansTrial/PlansMainDialogTrial";

export default {
  name: 'Plans',

  components: {
    PlansMainDialog,
    PlansCards,
    PlansCardsTrial,
    PlansMainDialogTrial
  },

  computed: {
    ...mapGetters({
      dialogs: 'plans/dialogs',
      profile: 'main/profile',
    }),
  }

};
</script>