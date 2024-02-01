<script>
// import Vue from 'vue';
// import VueMask from 'v-mask';

// Vue.use(VueMask);
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
    data() {
        return {
          phoneRules: [ v => !!v || 'Telefon jest wymagany', v => (v && v.replace(/\s/g, '').length === 9) || 'Telefon musi mieć 9 cyfer' ],
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
      const { valid } = await this.$refs.form.validate();
      this.valid = valid;
    },
    showAlert() {
      this.isAlertVisible = true;
      setTimeout(() => {
        this.isAlertVisible = false;
      }, 3000);
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
  <v-sheet class="mx-auto">
      <v-Form ref="form"  @input="validate" @submit.prevent="onSubmit" >
      <h1 style="text-align: center; margin: 3%;">Zarejestruj się</h1>
      <h2 style="text-align: center;" v-if="isAlertVisible" class="alert">Prosimy o chwilę cierpliwości...</h2>
        <div style="width: 20vw; display: flex; flex-direction: column;">
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
            class="passoword"
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
            class="passoword"
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
          <v-btn  @click="showAlert" color="success" block type="submit" :disabled="!valid">Zarejestruj</v-btn>
        </div>
      </v-Form>
  </v-sheet>
</template>
<style></style>
