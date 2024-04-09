<script>
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      firstnameRules: [(v) => !!v || "Imię jest wymagane"],
      lastnameRules: [(v) => !!v || "Nazwisko jest wymagane"],
      phoneRules: [(v) => !!v || "Numer telefonu jest wymagany"],
      emailRules: [(v) => !!v || "E-mail jest wymagany", (v) => /.+@.+\..+/.test(v) || "Wprowadź poprawny adres e-mail"],
      passwordRules: [
        (v) => !!v || "Hasło jest wymagane",
        (v) => (v && v.length >= 5) || "Hasło musi mieć minimum 5 znaków",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Potwierdzenie hasła jest wymagane",
        (v) => (v && v == this.form.password) || "Hasła nie są zgodne",
      ],
      titles:[],
      valid: false,
      form: {
        title: null,
        firstname: "",
        lastname: "",
        password: "",
        confirmPasswordRules: "",
        wantsToRate: null,
        enabled: null,
      },
      user: {
        title: null,
        role: null,
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        wantsToRate: null,
        enabled: null,
      },
    };
  },
  beforeMount(){
    this.axios.get(`http://localhost:8080/titles`).then((response) => {
      this.titles = response.data;
    });
  },
  mounted() {
    this.getUserDetails();
  },
  methods: {
    getUserDetails() {
      this.axios.get(`http://localhost:8080/users/details`).then((response) => {
        let data = response.data
        this.user.title = data.title
        this.user.firstname = data.firstname
        this.user.lastname = data.lastname
        this.user.phone = data.phone
        this.user.email = data.email
        this.user.role = data.role
        this.user.wantsToRate = data.wantsToRate
        this.user.enabled = data.enabled

        this.form.title = data.title.id
        this.form.firstname = data.firstname
        this.form.lastname = data.lastname
        this.form.email = data.email
        this.form.phone = data.phone
        this.form.role = data.role.id
        this.form.wantsToRate = data.wantsToRate
        this.form.enabled = data.enabled
      });
    },
    onSubmit(email) {
      if (window.confirm("Czy potwierdzasz zgodność danych?")) {
        this.axios
          .put(`http://localhost:8080/users/${email}`, this.form)
          .then((response) => {
            alert("Konto zostało edytowane.");
            this.formResponse = response.data
          })
          .catch((err) => {
            alert("Wystąpił nieoczekiwany błąd.");
          });
      }
    },

    async validate() {
      const { valid } = await this.$refs.form.validate();
      this.valid = valid;
    },
  },
};
</script>

<template>
    <v-Form class="bg-white " ref="form" @input="validate" @submit.prevent="onSubmit(user.email)">
        <h1>Profil użytkownika</h1>
            <v-select
            v-model="form.title"
            :items="titles"
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
            label="E-mail"
            type="email"
            :rules="emailRules"
            placeholder="adres@strona.pl"
            required
            ></v-text-field>
            <v-text-field
            v-model="form.phone"
            label="Telefon"
            :rules="phoneRules"
            placeholder="123456789"
            required
            :maxlength="9"
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
            <label id="labelPrintSize" for="wantsToRate"
            >Prosimy o zaznaczenie poniższego pola w przypadku chęci udziału
            koordynatora w pracach Komisji Sprawdzającej prace uczestników
            konkursu z etapu finałowego w swoim regionie. Na podstawie powyższej
            deklaracji Przewodniczący RKO MK „MBG” będzie mógł w razie potrzeby
            zaprosić koordynatora do udziału w sprawdzaniu prac konkursowych. O
            faktycznym udziale w pracach Komisji koordynator zdecyduje
            przyjmując bądź odrzucając otrzymane zaproszenie. Jednocześnie
            informujemy, że wszystkie osoby zaangażowane w organizację i
            przebieg konkursu działają na zasadzie wolontariatu. Deklaracja
            współpracy jest całkowicie dobrowolna.
          </label>
          <v-checkbox
            v-model="form.wantsToRate"
          ></v-checkbox>
          <v-btn color="success" block type="submit" :disabled="!valid">Zapisz</v-btn>
    </v-Form>
</template>
<style>

</style>