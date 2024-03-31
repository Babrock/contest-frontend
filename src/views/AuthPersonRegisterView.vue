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
      roleRules: [(v) => !!v || "Rola jest wymagana"],
      titleRules: [(v) => !!v || "Tytuł jest wymagany"],
      firstnameRules: [(v) => !!v || "Imię jest wymagane"],
      lastnameRules: [(v) => !!v || "Miasto jest wymagane"],
      phoneRules: [(v) => !!v || "Numer telefonu jest wymagany"],
      emailRules: [(v) => !!v || "E-mail jest wymagany"],
      passwordRules: [
        (v) => !!v || "Hasło jest wymagane",
        (v) => (v && v.length >= 5) || "Hasło musi mieć minimum 5 znaków",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Potwierdzenie hasła jest wymagane",
        (v) => (v && v == this.form.password) || "Hasła nie są zgodne",
      ],
    };
  },
  mounted() {
    this.axios.get(`http://localhost:8080/titles`).then((response) => {
      this.titles = response.data;
    }),
      this.axios.get(`http://localhost:8080/roles`).then((response) => {
        this.roles = response.data;
      });
  },
  methods: {
    onSubmit() {
      this.axios
        .post("http://localhost:8080/users", this.form)
        .then((response) => {
          alert("Formularz został zgłoszony.");
        })
        .catch((err) => {
          alert("Wystąpił nieoczekiwany błąd.");
        });
    },
  },
};
</script>
<template>
  <div class="w-100 bg-white">
    <v-form @submit.prevent="onSubmit" >
      <h1>Dane użytkownika do rejestracji</h1>
      <div >
        <div >
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
    <div >
      <v-text-field
        v-model="form.firstname"
        :rules="firstnameRules"
        label="Imie"
        required
      ></v-text-field>
      <v-text-field
        v-model="form.lastname"
        :rules="lastnameRules"
        label="Nazwisko"
        required
      ></v-text-field>
      <v-text-field
        v-model="form.phone"
        :counter="12"
        :rules="phoneRules"
        label="Numer telefonu"
        placeholder="+48 000 000 000"
        required
      ></v-text-field>
    </div>
    <div >
      <v-text-field
        v-model="form.email"
        :rules="emailRules"
        label="Email"
        required
      ></v-text-field>
      <v-text-field
        v-model="form.password"
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
        Field
        :validateOnInput="true"
        required
      ></v-text-field>
    </div>
      <v-checkbox v-model="form.wantsToRate" label="Chce oceniac" color="primary"></v-checkbox>
      <v-btn class="w-100" color="grey" type="submit"> Wyślij </v-btn>
    </div>
    </v-form>
  </div>
</template>

<style>
h1{
  text-align: center;
}
</style>
