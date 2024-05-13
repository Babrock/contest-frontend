<script>
export default {
  data() {
    return {
      phoneRules: [v => !!v || 'Telefon jest wymagany', v => (v && v.replace(/\s/g, '').length === 9) || 'Telefon musi mieć 9 cyfr'],
      firstnameRules: [(v) => !!v || "Imię jest wymagane"],
      lastnameRules: [(v) => !!v || "Nazwisko jest wymagane"],
      emailRules: [(v) => !!v || "E-mail jest wymagany"],
      passwordRules: [
        (v) => !!v || "Hasło jest wymagane",
        (v) => (v && v.length >= 5) || "Hasło musi mieć minimum 5 znaków",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Potwierdzenie hasła jest wymagane",
        (v) =>
            (v && v == this.form.password) || "Hasła nie są zgodne",
      ],
      titleRules: [(v) => !!v || "Tytuł jest wymagany"],
      titles: [],
      isAlertVisible: false,
      valid: false,
      form: {
        title: null,
        role: 2,
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        wantsToRate: 0,
        enabled: 0,
        region: null
      },
    }
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/titles`).then((response) => {
      this.titles = response.data;
    });
  },
  watch: {
    '$refs.form': {
      handler: 'validate',
      deep: true,
    },
  },
  methods: {
    async validate() {
      const {valid} = await this.$refs.form.validate();
      this.valid = valid;
    },
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
}
</script>
<template>
  <v-Form class="bg-white pa-1 pa-sm-5 w-sm-33 w-100" ref="form" @input="validate" @submit.prevent="onSubmit">
    <h1>Zarejestruj się</h1>
    <h2 v-if="isAlertVisible">Prosimy o chwilę cierpliwości...</h2>
    <v-select
        v-model="form.title"
        :items="titles"
        :rules="titleRules"
        item-value="id"
        item-title="name"
        label="Tytuł"
        required
    ></v-select>
    <v-text-field
        v-model="form.firstname"
        :rules="firstnameRules"
        label="Imię"
        required
    ></v-text-field>
    <v-text-field
        v-model="form.lastname"
        :rules="lastnameRules"
        label="Nazwisko"
        required
    ></v-text-field>
    <v-text-field
        v-model="form.email"
        :rules="emailRules"
        label="E-mail"
        type="email"
        placeholder="adres@strona.pl"
        required
    ></v-text-field>
    <v-text-field
        class="password"
        v-model="form.password"
        :rules="passwordRules"
        label="Hasło"
        type="password"
        Field
        :validateOnInput="true"
        @click:append="show1 = !show1"
        required
    ></v-text-field>
    <v-text-field
        class="password"
        v-model="form.confirmPassword"
        :rules="confirmPasswordRules"
        label="Potwierdź hasło"
        type="password"
        name="passwordConfirmation"
        Field
        :validateOnInput="true"
        required
    ></v-text-field>
    <v-text-field
        v-model="form.phone"
        :rules="phoneRules"
        label="Telefon"
        placeholder="000 000 000"
        required
        :max="9"
    ></v-text-field>
    <v-btn class="w-100" @click="showAlert" color="success" type="submit" :disabled="!valid">Zarejestruj</v-btn>
  </v-Form>
</template>