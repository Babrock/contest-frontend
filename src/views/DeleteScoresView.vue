<script>
export default {
    data() {
        return {
            schools: [],
            schoolClasses: [],
            school: 0,
            form: {
                schoolClass: 0,
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
            this.axios.delete(`http//localhost:8080/scores/${value}`).then(response => {
                alert("Wyniki zostały usunięte.")
            }).catch(err => {
                if (err.response.status === 403)
                    alert("Nie masz uprawnień.")
            })
        }
    },
}
</script>
<template>
    <div class="pageA4W">
        <form @submit.prevent="onSubmit">
            <h2>Usuwanie wyników</h2>
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
            <div class="buttons">
                <div>
                    <input type="submit" value="Usuń">
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