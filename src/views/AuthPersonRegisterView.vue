<script>
export default {
  data() {
    return {
      isAlertVisible: false,
      titles: [],
      roles: [],
      regions: [],
      form: {
        title: null,
        role: null,
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        wantsToRate: 0,
        enabled: 1,
        region: null,
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
  beforeMount() {
    this.axios.get(`http://localhost:8080/titles`).then((response) => {
      this.titles = response.data;
    }),
    this.axios.get(`http://localhost:8080/roles`).then((response) => {
      this.roles = response.data;
    });
    this.axios.get(`http://localhost:8080/regions`).then((response) => {
      this.regions = response.data;
    });
  },
  methods: {
    showAlert() {
      this.isAlertVisible = true;
      setTimeout(() => {
        this.isAlertVisible = false;
      }, 10000);
    },
    onSubmit() {
      this.showAlert()
      setTimeout(() => {
        this.axios
            .post("http://localhost:8080/emails-verification/send", this.form)
            .then((response) => {
              alert("Potwierdź link w mailu.");
            })
            .catch((err) => {
              if (err.response && err.response.status === 409 && err.response.data === "User with email " + this.form.email + " already exists") {
                alert("Użytkownik o podanym adresie e-mail już istnieje.");
              } else {
                alert("Wystąpił nieoczekiwany błąd.");
              }
            });
      }, 2000);
    },
  },
};
</script>
<template>
  <div class="w-100 bg-white">
    <v-form @submit.prevent="onSubmit" >
      <h1>Dane użytkownika do rejestracji</h1>
      <h2 v-if="isAlertVisible">Prosimy o chwilę cierpliwości...</h2>
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
          v-model="form.region"
          :items="regions"
          item-value="id"
          item-title="name"
          label="Wybierz region"
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
      <v-btn class="w-100" color="grey" type="submit">Zarejstruj użytkownika</v-btn>
    </div>
    </v-form>
  </div>
</template>

<style>
</style>
