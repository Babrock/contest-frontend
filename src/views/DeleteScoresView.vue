<script>
    export default {
        data(){
            return{
                schools: [],
                schoolClasses: [],
                school: 0,
                form:{

                }
            }
        },
        mounted() {
            this.axios.get(`http://localhost:8080/schools`).then((response) => {
                this.schools = response.data
            })
        },
        watch: {
            "formschool"(value){
                this.axios.get(`http//localhost:8080/classes?school_id=${value}`).then((response) => {
                    this.schoolClasses = response.data
                })
            }
        },
        methods: {
            onSubmit() {
                this.axios.post(`http//localhost:8080/scores/delete/`)
            }
        },
    }
</script>
<template>
    <div class="pageA4W">
        <form @submit.prevent="onSubmit" >
            <h2>Usuwanie widoków</h2>
            <div class="containerW">
                <label for="schools">Wybierz wyników:</label>
                <select id="schools" v-model="form.schools">
                    <option value="0">Wybierz szkołe</option>
                    <option v-for="school in schools" :value="school.id"> {{ school.name }}</option>
                </select>
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