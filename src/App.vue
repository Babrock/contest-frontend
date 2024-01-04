<script>
import { RouterLink, RouterView } from 'vue-router'
import { mapWritableState, mapState } from 'pinia'
import {useAuthStore} from '@/store/auth.js'

export default {
  computed: {
    ...mapWritableState(useAuthStore, ['isAuthenticated']),
    ...mapState(useAuthStore, ['role'])
  },
  methods: {
    logout() {
      this.axios.post('logout').then( () => {
        this.isAuthenticated = false
        this.$router.push('/login')
      }).catch(err => {
        alert('ups cos poszlo nie tak')
      })
    }
  }
}
</script>
<template>
    <header id="buttonDisplayNone">
      <nav>
        <RouterLink v-if="role=='ROLE_ADMIN'" to="/authPersonRegister">RejestracjaOsóbUpoważnionych</RouterLink>
        <RouterLink v-if="role=='ROLE_ADMIN' || role == 'ROLE_SCHOOL_COORDINATOR'" to="/allScores">Edycja punktów</RouterLink>
        <RouterLink v-if="role=='ROLE_ADMIN' || role == 'ROLE_SCHOOL_COORDINATOR'" to="/editProfile">Akceptacja</RouterLink>
        <RouterLink to="/register">Rejestracja</RouterLink>
        <RouterLink to="/">Strona Główna</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/form">Formularz</RouterLink>
        <!-- <RouterLink v-if="role=='ROLE_ADMIN' || role == 'ROLE_SCHOOL_COORDINATOR'" to="/addScores">Dodaj punkty</RouterLink>
        <RouterLink v-if="role=='ROLE_ADMIN' || role == 'ROLE_SCHOOL_COORDINATOR'" to="/deleteScores">Usuń punkty</RouterLink> -->
        <RouterLink to="/scores">Wyniki</RouterLink>
        <RouterLink to="/informations/statute">Informacje o konkursie</RouterLink>
        <RouterLink to="/location">Lokalizacja</RouterLink>
        <RouterLink v-if="!isAuthenticated" to="/login">Logowanie</RouterLink>
        <a v-if="isAuthenticated" @click="logout">wyloguj</a>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
</template>
<style scoped>
header {
  width: 100%;
  line-height: 3;
  background: rgba(4, 0, 255, 0.651);
  box-shadow: 0px 0px 10px 5px rgba(0, 13, 255, 0.5);
}

main {
  max-width: 1000px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

nav {
  width: auto;
  font-size: 14px;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  margin: auto;
}

nav a.router-link-exact-active {
  color: lightgray;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 1%;
  padding-top: 0%;
  padding-bottom: 0%;
  border-left: 1px solid var(--color-border);
}

nav a:hover {
  background-color: grey;
  cursor: pointer;
}

nav a:first-of-type {
  border: 0;
}
</style>
