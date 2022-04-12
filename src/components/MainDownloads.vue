<template>
  <v-card
    outlined
    class="mr-2"
  >
    <!-- <v-card-title style="font-weight: 300;">
      {{ $t('common.download') }}
    </v-card-title> -->
    <v-card-text>
      <v-list dense>
        <v-list-item-group color="primary">
          <!-- <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('common.download') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item> -->
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
</template>

<script>
export default {
  name: 'MainDownloads'
}
</script>