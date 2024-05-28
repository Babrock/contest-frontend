<script>
import {mapWritableState, mapState} from 'pinia'
import {useAuthStore} from '@/store/auth.js'
import NavigationBar from "@/components/NavigationBar.vue";
import AcceptedSchoolsView from "@/views/AcceptedSchoolsView.vue";

export default {
  name: 'ParentComponent',
  components: {AcceptedSchoolsView, NavigationBar},
  data() {
    return {
      drawer: false,
      editions: [],
      selectedEdition: {id: null, name: null},
      navList: [
        {title: "Rejestracja", to: "/register"},
        {title: "Strona Główna", to: "/"},
        {title: "Wyniki", to: "/scores"},
        {title: "Informacje O Konkursie", to: "/informations/statute"},
        {title: "Lokalizacja", to: "/location"},
        {title: "Formularz", to: "/form"},
        {title: "Zarejestrowane Szkoły", to: "/acceptedSchools"},
      ],
      itemsToEdit: [
        {title: 'Edytuj Regiony', to: '/regions', show: this.isAuthenticated || this.role === 'ROLE_ADMIN'},
        {title: 'Edytuj Profil', to: '/edit-profile', show: this.isAuthenticated || this.role == 'ROLE_ADMIN' || this.role == 'ROLE_SCHOOL_COORDINATOR'},
        {title: 'Edycja punktów', to: '/edit-score', show: this.isAuthenticated || this.role == 'ROLE_ADMIN' || this.role == 'ROLE_REGION_COORDINATOR'},
        {title: 'Edytuj Formularza', to: '/edit-form',show: this.isAuthenticated || this.role === 'ROLE_ADMIN' || this.role == 'ROLE_COORDINATOR'        },
      ],
      other: [
        {title: 'RejestracjaOsóbUpoważnionych', to: '/auth-person-register', show: this.isAuthenticated || this.role === 'ROLE_ADMIN'},
        {title: 'Zaakceptuj Formularz', to: '/accept-form', show: this.isAuthenticated || this.role == 'ROLE_ADMIN' || this.role == 'ROLE_COORDINATOR' || this.role == 'ROLE_REGION_COORDINATOR'},
        {title: 'Export CSV', to: '/export-csv', show: this.isAuthenticated || this.role == 'ROLE_ADMIN'},
        {title: 'Import CSV', to: '/import-csv', show: this.isAuthenticated || this.role == 'ROLE_ADMIN'},
        {title: 'Wyślij wiadomość', to: '/send-email', show: this.isAuthenticated},
        {title: 'Dodaj nową edycję', to: '/add-edition', show: this.isAuthenticated || this.role == 'ROLE_ADMIN' || this.role == 'ROLE_COORDINATOR'},
      ],
    }
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/editions`).then((response) => {
      this.editions = response.data;
      if (this.editions.length > 0) {
        this.selectedEdition.id = this.editions[0].id
        this.selectedEdition.name = this.editions[0].name
      }
    });
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
    editionChange(item) {
      this.selectedEdition = item;
    },
  },
}
</script>
<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar class="bg-blue-accent-4">
        <navigation-bar @click="drawer = !drawer" :nav-list="navList" :items-to-edit="itemsToEdit"  :other="other" :editions="editions" :selected-edition="selectedEdition" @editionIdSelected="editionChange"></navigation-bar>
    </v-app-bar>
    <v-navigation-drawer disable-resize-watcher v-model="drawer">
      <v-list>
        <v-list-item v-for="(item, index) in navList" link :key="index" :title="item.title" :to="item.to"/>

        <v-list-item link title="Opcje" v-if="role=='ROLE_ADMIN' || this.role == 'ROLE_COORDINATOR' || this.role == 'ROLE_COORDINATOR_REGION' ">
          <v-menu activator="parent" location="end">
            <v-list>
              <v-list-item link title="Edytuj" v-if="role=='ROLE_ADMIN' || this.role == 'ROLE_COORDINATOR' || this.role == 'ROLE_COORDINATOR_REGION' ">
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
        <v-list-item link title="Wybierz Edycje" >
          <v-menu activator="parent" >
            <v-list>
              <v-list-item
                  v-for="(item, index) in editions"
                  :key="index"
                  :value="index"
                  link
                  @click="editionChange(item)"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>

          </v-menu>
          <v-list-item-title>Wybrana edycja: {{ selectedEdition.name }}</v-list-item-title>

        </v-list-item>
        <v-list-item link title="Zaloguj" v-if="!isAuthenticated" to="/login"></v-list-item>
        <v-spacer></v-spacer>
        <v-list-item link title="wyloguj" v-if="isAuthenticated" to="/login" @click="logout"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="d-flex align-center justify-center ">
      <router-view :edition-id="selectedEdition.id"/>
    </v-main>
  </v-layout>
</template>

<style scoped>

</style>
