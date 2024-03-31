<template>
  <div class="h-100 d-flex flex-column px-10 pb-10">
    <div class="d-flex">
      <nav>
        <RouterLink to="/informations/statute">Regulamin konkursu MBG Senior</RouterLink>
        <RouterLink to="/informations/genesis">Geneza konkursu</RouterLink>
        <RouterLink to="/informations/idee">Idea konkursu</RouterLink>
        <RouterLink to="/informations/awards">Nagrody konkursu</RouterLink>
        <RouterLink to="/informations/specification">Specyfikacja zadań konkursowych</RouterLink>
        <RouterLink to="/informations/conditions">Warunki udziału w konkursie</RouterLink>
        <RouterLink to="/informations/rules">Zasady ogólne</RouterLink>
      </nav>
    </div>
    <div class="d-flex">
      <RouterView/>
    </div>
  </div>
</template>

<style>
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
  background-color: lightgray;
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