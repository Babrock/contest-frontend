<template>
    <header> Wyniki
    </header>
    <main>
        <RouterView />
    </main>
</template>

<style>
header {
  margin-top: 1rem;
  line-height: 1.5;
  max-height: 10vh;
  background: rgb(8, 71, 92);
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
</style>
