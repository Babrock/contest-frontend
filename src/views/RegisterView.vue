<script>
export default {
    data() {
        return {
            titles: [],
            roles: [],
            form: {
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                wantsToRate: 0,
                title: 0,
                role: 0,
            }
        }
    },
    mounted() {
        this.axios.get(`http://localhost:8080/titles`).then((response) => {
            this.titles = response.data
        }),
            this.axios.get(`http://localhost:8080/roles`).then((response) => {
                this.roles = response.data
            })
    },
    methods: {
        onSubmit() {
            this.axios.post('http://localhost:8080/users', this.form).then(response => {
                alert("Formularz został zgłoszony.")
            }).catch(err => {
                alert('Wystąpił nieoczekiwany błąd.')
            })
        }
    },
}
</script>
<template>
    <div class="pageA4">
        <form @submit.prevent="onSubmit">
            <div class="container">
                <div class="w-100">
                    <label for="">Dane użytkownika do rejestracji</label>
                    <div>
                        <label for="roles">Wybierz role:</label>
                        <select id="roles" v-model="form.role">
                            <option value="0">Wybierz role</option>
                            <option v-for="role in roles" :value="role.id"> {{ role.name }} </option>
                        </select>
                    </div>
                </div>
                <div class="w-100">
                    <label for="titles">Wybierz tytuł:</label>
                    <select id="titles" v-model="form.title">
                        <option value="0">Wybierz tytuł</option>
                        <option v-for="title in titles" :value="title.id"> {{ title.name }} </option>
                    </select>
                </div>
                <div class="w-100">
                    <label for="firstname">Imie</label>
                    <input v-model="form.firstname" type="text" name="firstname" placeholder="Imie">
                </div>
                <div class="w-100">
                    <label for="lastname">Nazwisko</label>
                    <input v-model="form.lastname" name="lastname" type="text" placeholder="Nazwisko">
                </div>
                <div class="w-100">
                    <label for="email">Email</label>
                    <input v-model="form.email" name="email" type="text" placeholder="Email">
                </div>
                <div class="w-100">
                    <label for="password">Hasło</label>
                    <input v-model="form.password" name="password" type="text" placeholder="Hasło">
                </div>
                <div>
                    <label for="wantsToRate">Chce oceniac</label>
                </div>
                <input type="checkbox" id="wantsToRate" v-model="form.wantsToRate" />
            </div>

            <div class="buttons">
                <div>
                    <input type="submit" value="Wyślij">
                </div>
            </div>
            {{  form  }}
        </form>
    </div>
</template>

<style>

</style>