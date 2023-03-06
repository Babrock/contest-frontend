<script>

export default {
    data() {
        return {
            schools: [],
            schoolClasses: [],
            school: 0,
            form: {
                schoolClass: 0,
                task1: 0,
                task2: 0,
                task3: 0,
                task4: 0,
                task5: 0,
                task6: 0,
                task7: 0,
                task8: 0,
                task9: 0,
            }
        }
    },
    mounted() {
        this.axios.get(`http://localhost:8080/schools`).then((response) => {
            this.schools = response.data
        })
    },
    watch: {
        "form.school"(value) {
      this.axios.get(`http://localhost:8080/classes?school_id=${value}`).then((response) => {
        this.schoolClasses = response.data
      })
    }
    },
    methods: {
        onSubmit() {
            this.axios.post('http://localhost:8080/scores/add', this.form).then(response => {
                console.log(response);
                // alert("Wyniki zostały dodane.")
            }).catch(err => {
                if (err.response.status === 403)
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
                <label for="schools">Wybierz szkołe:</label>
                <select id="schools" v-model="form.school">
                    <option value="0">Wybierz szkołe</option>
                    <option v-for="school in schools" :value="school.id"> {{ school.name }}
                    </option>
                </select>
            </div>
            <div class="containerW">
                <label for="schoolClasses">Wybierz klasę:</label>
                <select id="schoolClasses" v-model="form.schoolClass">
                    <option value="0">Wybierz klasę</option>
                    <option v-for="schoolClass in schoolClasses" :value="schoolClass.id"> {{ schoolClass.name }}
                    </option>
                </select>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad1">zadanie 1:</label>
                    <input v-model="form.task1" type="number"  min="0" max="100" step="0.01" name="zad1" placeholder="Zadanie 1">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad1">zadanie 2:</label>
                    <input v-model="form.task2" type="number" min="0" max="100" step="0.01" name="zad2" placeholder="Zadanie 2">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad3">zadanie 3:</label>
                    <input v-model="form.task3" type="number" min="0" max="100" step="0.01" name="zad3" placeholder="Zadanie 3">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad1">zadanie 4:</label>
                    <input v-model="form.task4" type="number" min="0" max="100" step="0.01" name="zad4" placeholder="Zadanie 4">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad5">zadanie 5:</label>
                    <input v-model="form.task5" type="number" min="0" max="100" step="0.01" name="zad5" placeholder="Zadanie 5">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad6">zadanie 6:</label>
                    <input v-model="form.task6" type="number" min="0" max="100" step="0.01" name="zad6" placeholder="Zadanie 6">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad7">zadanie 7:</label>
                    <input v-model="form.task7" type="number" min="0" max="100" step="0.01" name="zad7" placeholder="Zadanie 7">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad8">zadanie 8:</label>
                    <input v-model="form.task8" type="number" min="0" max="100" step="0.01" name="zad8" placeholder="Zadanie 8">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="zad9">zadanie 9:</label>
                    <input v-model="form.task9" type="number" min="0" max="100" step="0.01" name="zad9" placeholder="Zadanie 9">
                </div>
            </div>
            <div class="buttons">
                <div>
                    <input type="submit" value="Wyślij">
                </div>
            </div>
            <div>
                {{ form }}
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