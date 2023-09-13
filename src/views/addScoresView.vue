<script>
export default {
    data() {
        return {
            schools: [],
            schoolClasses: [],
            school: 0,
            form: {
                schoolClass: 0,
                name: 0,
                score: 0,
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
            if (window.confirm("Czy na pewno chcesz dodać wyniki?")) {
                this.axios.post('http://localhost:8080/tasks/add', this.form).then(response => {
                    alert("Wyniki zostały dodane.")
                }).catch(err => {
                    if (err.response.status === 403)
                        alert('Nie masz uprawnien.')
                })
            }
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
                    <option v-for="school in schools" :value="school.id"> {{ school.name }} </option>
                </select>
            </div>
            <div class="containerW">
                <label for="schoolClasses">Wybierz klasę:</label>
                <select id="schoolClasses" v-model="form.schoolClass">
                    <option value="0">Wybierz klasę</option>
                    <option v-for="schoolClass in schoolClasses" :value="schoolClass.id"> {{ schoolClass.name }}</option>
                </select>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="taskName">Numer zadania</label>
                    <input v-model="form.name" type="text" name="taskName" placeholder="Numer zadania">
                </div>
            </div>
            <div class="containerW">
                <div class="w-100">
                    <label for="Liczba punktów">Liczba punktów</label>
                    <input v-model="form.score" type="number" min="0" max="100" step="0.5" name="score"
                        placeholder="Liczba punktów">
                </div>
            </div>
            <div class="buttons">
                <div>
                    <input type="submit" value="Wyślij">
                </div>
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