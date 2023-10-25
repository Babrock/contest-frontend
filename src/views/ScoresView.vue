<template>
  <nav>
    <RouterLink to="/scores/currentStatistics">Bieżąca statystyka</RouterLink>
    <RouterLink to="/scores/participantsByRegion">Uczestnicy konkursu wg regionu</RouterLink>
    <RouterLink to="/scores/participantsByVoivodeship">Uczestnicy konkursu wg województwa</RouterLink>
    <RouterLink to="/scores/resultsByRegion">Wyniki wg regionów</RouterLink>
    <RouterLink to="/scores/resultsByVoivodeship">Wyniki wg województw</RouterLink>
  </nav>
  <div>
    <RouterView/>
  </div>
</template>

<style>
.side-bar {
    color: black;
    font-size: 14px;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
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
  color: yellow;
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


