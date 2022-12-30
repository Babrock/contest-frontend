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
  <div>
    <header>
      <nav>
        <RouterLink v-if="role=='ROLE_ADMIN'" to="/register">Rejestracja</RouterLink>
        <RouterLink to="/">Strona Główna</RouterLink>
        <RouterLink v-if="!isAuthenticated" to="/login">Logowanie</RouterLink>
        <RouterLink to="/form">Formularz</RouterLink>
        <RouterLink v-if="role=='ROLE_ADMIN' || role == 'ROLE_COORDINATOR'" to="/addScores">Dodaj punkty</RouterLink>
        <RouterLink to="/scores">Wyniki</RouterLink>
        <RouterLink to="/informations/statute">Informacje o konkursie</RouterLink>
        <RouterLink to="/location">Lokalizacja</RouterLink>
        <a v-if="isAuthenticated" @click="logout">wyloguj</a>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
<style scoped>
header {
  margin-top: 1px;
  line-height: 3;
  background: rgb(0, 0, 0);
  box-shadow: 0px 0px 10px 5px rgba(0, 13, 255, 0.5);
}

main {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

nav {
  width: auto;
  font-size: 16px;
  text-align: center;
  margin: 1%;
  
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  margin: auto;
}

nav a.router-link-exact-active {
  color: var(--color-text);
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


/* @media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
