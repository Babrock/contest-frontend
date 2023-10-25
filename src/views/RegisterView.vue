<script>
export default {
    data() {
        return {
            titles: [],
            roles: [],
            form: {
                firstname: "",
                lastname: "",
                phone: "",
                email: "",
                password: "",
                confirmPassword: "",
                wantsToRate: 0,
                title: null,
                role: null,
            },
            roleRules: [
                v => !!v || 'Rola jest wymagana',
            ],
            titleRules: [
                v => !!v || 'Tytuł jest wymagany',
            ],
            firstnameRules: [
                v => !!v || 'Imię jest wymagane',
            ],
            lastnameRules: [
                v => !!v || 'Miasto jest wymagane',
            ],
            phoneRules: [
                v => !!v || 'Numer telefonu jest wymagany',
            ],    
            emailRules: [
                v => !!v || 'E-mail jest wymagany',
            ],  
            passwordRules: [
                v => !!v || 'Hasło jest wymagane',
                v => (v && v.length >= 5) || 'Hasło musi mieć minimum 5 znaków',
            ],
            confirmPasswordRules: [
                v => !!v || 'Potwierdzenie hasła jest wymagane',
                v => (v && v == this.form.password ) || 'Hasła nie są zgodne',
            ],
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
<template >
    <v-sheet class="mx-auto">
        
            <v-form @submit.prevent="onSubmit" >
                <legend>Dane użytkownika do rejestracji</legend>

                <div>
                    <!-- <label for="roles">Wybierz role:</label>
                    <select id="roles" v-model="form.role">
                        <option value="0">Wybierz role</option>
                        <option v-for="role in roles" :value="role.id"> {{ role.name }} </option>
                    </select> -->
                    <v-select
                    v-model="form.role"
                    :items="roles"
                    item-value="id"
                    item-title="name"
                    label="Wybierz role"
                    required
                    ></v-select>
                    <v-select
                    v-model="form.title"
                    :items="titles"
                    item-value="id"
                    item-title="name"
                    label="Wybierz tytuł"
                    required
                    ></v-select>
                </div>
                <div>
                    <!-- <label for="titles">Wybierz tytuł:</label>
                    <select id="titles" v-model="form.title">
                        <option value="0">Wybierz tytuł</option>
                        <option v-for="title in titles" :value="title.id"> {{ title.name }} </option>
                    </select> -->
                    <v-text-field
                    v-model="form.firstname"
                    :counter="20"
                    :rules="firstnameRules"
                    label="Imie"
                    required
                    ></v-text-field>  
                    <v-text-field
                    v-model="form.lastname"
                    :counter="20"
                    :rules="lastnameRules"
                    label="Nazwisko"
                    required
                    ></v-text-field>    
                </div>
                <div>
                    <!-- <label for="firstname">Imie</label>
                    <input v-model="form.firstname" type="text" name="firstname" placeholder="Imie"> -->

                    <v-text-field
                    v-model="form.phone"
                    :counter="12"
                    :rules="phoneRules"
                    label="Numer telefonu"
                    placeholder="+48 000 000 000"
                    required
                    ></v-text-field>  
                    <v-text-field
                    v-model="form.email"
                    :counter="20"
                    :rules="emailRules"
                    label="Email"
                    required
                    ></v-text-field>  
                </div>
                <div>
                    <!-- <label for="lastname">Nazwisko</label>
                    <input v-model="form.lastname" name="lastname" type="text" placeholder="Nazwisko"> -->
                    <v-text-field
                    v-model="form.password"
                    :counter="20"
                    :rules="passwordRules"
                    type="password"
                    label="Hasło"
                    required
                    ></v-text-field>    
                    <v-text-field
                    v-model="form.confirmPassword"
                    :rules="confirmPasswordRules"
                    label="Potwierdź hasło"
                    type="password" 
                    name="passwordConfirmation"
                    Field  :validateOnInput="true"
                    required
                    ></v-text-field>
                </div>
                    <!-- <label for="email">Email</label>
                    <input v-model="form.email" name="email" type="text" placeholder="Email"> -->

                    <!-- <label for="password">Hasło</label>
                    <input v-model="form.password" name="password" type="text" placeholder="Hasło"> -->
                <div style="display: flex;">
                    <label style="margin-top: 15px;" for="wantsToRate">Chce oceniac</label>
                    <v-checkbox 
                        v-model="form.wantsToRate"
                    ></v-checkbox>
                </div>

                <!-- <input type="checkbox" id="wantsToRate" v-model="form.wantsToRate" /> -->
                <v-btn color="grey" class="mt-4" type="submit">
                    Wyślij
                </v-btn>
            </v-form>
    </v-sheet>
</template> 

<style>
</style>