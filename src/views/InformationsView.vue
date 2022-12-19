<template>
    <div class="row">
        <div class="side-bar w-100">
            <RouterLink to="/informations/statute">Regulamin konkursu MBG Senior</RouterLink>
            <RouterLink to="/informations/genesis">Geneza konkursu </RouterLink>
            <!-- <a href="genezaKonkursu.html" target="okno">Geneza konkursu </a>
            <a href="warunkiUdzialuwKonkursie.html" target="okno">Warunki udziału w konkursie </a>
            <a href="specyfikacjaZadanKonkursowych.html" target="okno">Specyfika zadań konkursowych </a>
            <a href="ideeKonkursu.html" target="okno">Idee konkursu</a>
            <a href="zasadyOgolne.html" target="okno">Zasady ogólne</a>
            <a href="nagrody.html" target="okno">Nagrody</a> -->
        </div>
        <div>
            <RouterView/>
            <!-- <iframe name="okno" src=""></iframe> -->

            <!-- <a href="regse.pdf"><b>Pobierz Regulamin</b></a> -->
            <!-- <a href="RegJr.pdf"><b>Pobierz Regulamin Junior</b></a> -->
        </div>
    </div>
</template>

<style>
/* iframe {
    width: 100%;
    height: 500px;
    margin: 3%;
} */

.side-bar {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
}
</style>