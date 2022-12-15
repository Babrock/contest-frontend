<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>
<template>
  <div>
    <header>
      <nav>
        <RouterLink to="/">Strona Główna</RouterLink>
        <RouterLink to="/login">Logowanie</RouterLink>
        <RouterLink to="/form">Formularz</RouterLink>
        <RouterLink to="/results">Wyniki</RouterLink>
        <RouterLink to="/informations">Informacje o konkursie</RouterLink>
        <RouterLink to="/location">Lokalizacja</RouterLink>
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
  min-height: 10vh;
  max-height: 10vh;
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
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 3rem;
  border-left: 1px solid var(--color-border);
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
