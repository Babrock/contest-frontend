<script>
// import Vue from 'vue';
// import VueMask from 'v-mask';

// Vue.use(VueMask);
export default {
    data() {
        return {
          phoneRules: [ v => !!v || 'Telefon is required', v => (v && v.replace(/\s/g, '').length === 9) || 'Telefon musi mieć 9 znaków' ],
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
              (v && v == this.form.coordinator.password) || "Hasła nie są zgodne",
          ],
          titleRules: [(v) => !!v || "Tytuł jest wymagany"],
          titles: [],
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
  methods: {
    onSubmit() {
      this.axios
        .post("http://localhost:8080/send", this.form)
        .then((response) => {
          alert("Potwierdź link w mailu.");
        })
        .catch((err) => {
          alert("Wystąpił nieoczekiwany błąd.");
        });
    },
  },
}
</script>
<template>
  <v-sheet class="mx-auto">
    <div class="pageA4">
      <v-Form ref="form" @submit.prevent="onSubmit" >
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
            :maxlength="9"
          ></v-text-field>
          <v-btn color="success" block type="submit">Zarejestruj</v-btn>
        </div>
      </v-Form>
    </div>
  </v-sheet>
</template>
<style></style>
