<script>

export default {
    data() {
        return {
            scores: {
                zad1: 0,
                zad2: 0,
                zad3: 0,
                zad4: 0,
                zad5: 0,
                zad6: 0,
                zad7: 0,
                zad8: 0,
                zad9: 0,
            }
        }
    },
    methods: {
        onSubmit() {
            this.axios.post('http://localhost:8080/scores', this.scores).then(response => {
                console.log(response);
                // alert("Wyniki zostały dodane.")
            }).catch(err => {
                if(err.response.status === 403)
                alert('Nie masz uprawnien')
            })
        }
    }
}
</script>

<template>
    <div class="pageA4W">
        <form @submit.prevent="onSubmit">
            <h2>Dodawanie wyników</h2>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad1">zadanie 1:</label>
                    <input v-model="scores.zad1" type="text" name="zad1" placeholder="Zadanie 1">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad1">zadanie 2:</label>
                    <input v-model="scores.zad2" type="text" name="zad2" placeholder="Zadanie 2">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad3">zadanie 3:</label>
                    <input v-model="scores.zad3" type="text" name="zad3" placeholder="Zadanie 3">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad1">zadanie 4:</label>
                    <input v-model="scores.zad4" type="text" name="zad4" placeholder="Zadanie 4">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad5">zadanie 5:</label>
                    <input v-model="scores.zad5" type="text" name="zad5" placeholder="Zadanie 5">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad6">zadanie 6:</label>
                    <input v-model="scores.zad6" type="text" name="zad6" placeholder="Zadanie 6">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad7">zadanie 7:</label>
                    <input v-model="scores.zad7" type="text" name="zad7" placeholder="Zadanie 7">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad8">zadanie 8:</label>
                    <input v-model="scores.zad8" type="text" name="zad8" placeholder="Zadanie 8">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad9">zadanie 9:</label>
                    <input v-model="scores.zad9" type="text" name="zad9" placeholder="Zadanie 9">
                </div>
            </div>
            <div class="buttons">
                <div>
                    <input type="submit" value="Wyślij">
                </div>
            </div>
            <div>
                {{ scores }}
            </div>
        </form>
    </div>
</template>

<style>
.pageA4W {
    margin: auto;
    margin-top: 2%;
    /* width: 50%; */
    color: rgb(0, 0, 0);
    background-color: #ffffff;
    border-radius: 20px;
}

.containerW {
    background-color: lightgray;
    margin: 5%;
    padding: 3%;
    border: 1px solid black;
    display: flex;
    flex-wrap: wrap;
    row-gap: 1mm;
    justify-content: 0;
}

.containerW input {
    width: 50%;
}

.containerW label {
    width: 50%;
}
</style>