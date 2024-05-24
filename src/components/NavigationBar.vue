<script>
import {mapState, mapWritableState} from "pinia";
import {useAuthStore} from "@/store/auth";

export default {
  emits: ['click', 'editionIdSelected'],
  props: ['drawer', 'navList', 'itemsToEdit', 'other', 'editions', 'selected-edition'],
  data() {
    return {
      menuOpen: false
    }
  },
  computed: {
    ...mapWritableState(useAuthStore, ['isAuthenticated']),
    ...mapState(useAuthStore, ['role'])
  },
  methods: {
    logout() {
      this.isAuthenticated = false
      this.$router.push('/login')
    },
    selectEdition(item) {
      this.menuOpen = false
      this.$emit('editionIdSelected', item);
    },
  },
}
</script>
<template>
  <v-app-bar-nav-icon @click="$emit('click')"></v-app-bar-nav-icon>
  <v-list-item class="hidden-on-mobile" v-for="(item, index) in navList" link :key="index" :title="item.title" :to="item.to"/>

  <v-list-item class="hidden-on-mobile" link title="Opcje" v-if="role=='ROLE_ADMIN' || this.role == 'ROLE_COORDINATOR' || this.role == 'ROLE_COORDINATOR_REGION'">
    <v-menu activator="parent">
      <v-list>
        <v-list-item class="hidden-on-mobile" link title="Edytuj" v-if="role=='ROLE_ADMIN' || this.role == 'ROLE_COORDINATOR' || this.role == 'ROLE_COORDINATOR_REGION'">
          <v-menu activator="parent" location="end">
            <v-list>
              <v-list-item
                  v-for="(item, index) in itemsToEdit"
                  :key="index"
                  link :title="item.tile" :to="item.to"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
        <v-list-item
            v-for="(item, index) in other"
            :key="index"
            :value="index"
            link :title="item.tile" :to="item.to"
        >

          <v-list-item-title>{{ item.title }}</v-list-item-title>

        </v-list-item>

      </v-list>

    </v-menu>
  </v-list-item>
  <v-list-item link title="Wybierz Edycje">
    <v-menu v-model="menuOpen" activator="parent">
      <v-list>
        <v-list-item
            v-for="(item, index) in editions"
            :key="index"
            :value="index"
            link
            @click="selectEdition(item)"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-list-item>
  <v-list-item-title style="margin-left: -1%">: {{ selectedEdition.name }}</v-list-item-title>
  <v-list-item link title="Zaloguj" v-if="!isAuthenticated" to="/login"></v-list-item>
  <v-spacer></v-spacer>
  <v-list-item link title="wyloguj" v-if="isAuthenticated" to="/login" @click="logout"></v-list-item>
</template>

<style scoped>
@media screen and (max-width: 600px) {
  .hidden-on-mobile {
    display: none;
  }
}
</style>