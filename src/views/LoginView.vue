<template>
  <div class="layout">
    <header class="napis">
        Logowanie 
    </header>
    <main>
        MAIN tu jest, chyba
    </main>
  </div>
</template>

<style>
.napis{
  color: black;
}
header {
  /* margin-top: 1rem;
  line-height: 1.5;
  max-height: 10vh;
  background: rgb(8, 71, 92);
  box-shadow:  0px 0px 10px 5px rgba(0, 255, 47, 0.5);
  place-items: center; */

  margin-top: 1rem;
  line-height: 1.5;
  /* max-height: 10vh; */
  background: #55d86d;
  box-shadow:  0px 0px 10px 5px rgba(0, 255, 47, 0.5);

}

main {
    min-height: 100vh;
    max-height: 10vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between; 
    align-items: center;
  }

.layout{
  width: 100%;
}
</style>
