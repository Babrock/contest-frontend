<script>
import { toHandlers } from 'vue';

export default {
  data() {
    return {
      form: {
        id: null,
      },
      school: {
        name: "",
        city: "",
        community: "",
        county: "",
        voivodeship:"",
        address: "",
        apartmentNumber: "",
        email: "",
        phone: "",
        street: "",
        post: "",
        zipCode: "",
        headmaster:{
          title: "",
          firstname: "",
          lastname: "",
          email: ""
        }
      },
      user: null,
      schoolClasses: {},
      schoolKeyNames: {
        name: "Nazwa szkoły",
        city: "Miasto",
        address: "Numer budynku",
        apartmentNumber: "Numer lokalu",
        email: "E-mail",
        phone: "Telefon",
        street: "Ulica",
        post: "Miejscowość",
        zipCode: "Kod pocztowy",
        headmaster:{
          title: "Tytuł Dyrektora",
          firstname: "Imie Dyrektora",
          lastname: "Nazwisko Dyrektora",
          email: "E-mail Dyrektora"
        }
      },
      userKeyNames: {
        email: "E-mail",
        title: "Tytuł",
        firstname: "Imie Koordynatora",
        lastname: "Nazwisko Koordynatora",
        phone: "Telefon",
        wantsToRate: "Chęć udziału Koordynatora w pracach Komisji Sprawdzającej",
      },
    };
  },
  methods: {
    onSubmit() {
      if (!this.form.id) {
        window.alert("Wprowadź poprawdny kod formularza");
        return;
      }

      this.axios
        .get(`http://localhost:8080/form/${this.form.id}`)
        .then((response) => {
          let data = response.data
          this.school.name = data.school.name
          this.school.city = data.school.city.name
          this.school.community = data.school.city.community.name
          this.school.county = data.school.city.community.county.name
          this.school.voivodeship = data.school.city.community.county.voivodeship.name
          this.school.address = data.school.address
          this.school.apartmentNumber = data.school.apartmentNumber
          this.school.email = data.school.email
          this.school.street = data.school.street
          this.school.post = data.school.post
          this.school.zipCode = data.school.zipCode

          this.school.headmaster.title = data.school.headmaster.title
          this.school.headmaster.firstname = data.school.headmaster.firstname
          this.school.headmaster.lastname = data.school.headmaster.lastname
          this.school.headmaster.email = data.school.headmaster.email

          this.user = data.user
          this.user.title = data.user.title.name
          this.user.wantsToRate = data.user.wantsToRate
            ? "Tak"
            : "Nie";
        })
        .catch((error) => {
          window.alert("Nie ma takiego formularza!");
        });
      this.axios
        .get(`http://localhost:8080/classes?form_id=${this.form.id}`)
        .then((response) => {
          this.schoolClasses = response.data;
        });
    },
  },
};
</script>

<template>
  <div class="pageA4">
    <v-Form ref="form" @submit.prevent="onSubmit">
      <h2
        style="
          text-align: center;
          margin-top: 0.5%;
          background-color: rgb(var(--v-theme-on-surface-variant));
        "
      >
        Akceptacja formularza
      </h2>
      <v-text-field
        v-model="form.id"
        label="Kod formularza"
        type="number"
        min="0"
        required
      ></v-text-field>
      <div style="width: 100%; display: flex; justify-content: space-between">
        <v-btn color="grey" type="submit">Pobierz formularz</v-btn>
        <v-btn color="success">Akceptuj formularz</v-btn>
        <v-btn color="warning">Wycofaj formularz</v-btn>
        <v-btn color="error">Usuń formularz</v-btn>
      </div>
      
      <div class="mt-4" style="width: 100%; display: flex; flex-wrap: wrap">
        <legend>Dane Szkoły:</legend>
        <!-- <v-text-field v-for="(value, key) in school" :key="key" readonly>
          <strong>{{ schoolKeyNames[key] }}: &nbsp; </strong> {{ school }}
        </v-text-field> -->
        <v-text-field readonly><strong>Województwo: &nbsp;</strong>{{ school.voivodeship }} &nbsp;</v-text-field>
        <v-text-field readonly><strong>Powiat: &nbsp;</strong>{{ school.county }} &nbsp;</v-text-field>
        <v-text-field readonly><strong>Gmina: &nbsp;</strong>{{ school.community }} &nbsp;</v-text-field>
        <v-text-field readonly><strong>Miasto: &nbsp;</strong>{{ school.city }} &nbsp;</v-text-field>
        <v-text-field readonly><strong>Nazwa szkoły: &nbsp;</strong> {{ school.name }} &nbsp;</v-text-field>
        <v-text-field readonly><strong>Numer budynku: &nbsp;</strong>{{ school.address }} &nbsp;</v-text-field>
        <v-text-field readonly><strong>Telefon: &nbsp;</strong>{{ school.phone }} &nbsp;</v-text-field>
        <v-text-field readonly><strong>E-mail: &nbsp;</strong> {{ school.email }} &nbsp;</v-text-field>
        <v-text-field readonly><strong>Ulica: &nbsp;</strong>{{ school.street }} &nbsp;</v-text-field>
        <v-text-field readonly><strong>Numer lokalu: &nbsp;</strong>{{ school.apartmentNumber }} &nbsp;</v-text-field>
        <v-text-field readonly><strong>Kod pocztowy: &nbsp;</strong> {{ school.zipCode }} &nbsp;</v-text-field>
        <v-text-field readonly><strong>Miejscowośc: &nbsp;</strong>{{ school.post }} &nbsp;</v-text-field>
        <legend >Dane Dyrektora Szkoły:</legend>
        <v-text-field v-for="(value, key) in school.headmaster" :key="key" readonly>
          <strong>{{ schoolKeyNames.headmaster[key] }}: &nbsp; </strong> {{ value }}
        </v-text-field>
      </div>
      <div style="width: 100%; display: flex; flex-wrap: wrap">
        <legend>Dane dotyczace Nauczyciela koordynujacego przebieg konkursu wszkole:</legend>
        <v-text-field v-for="(value, key) in user" :key="key" readonly>
          <strong>{{ userKeyNames[key] }}: &nbsp; </strong> {{ value }}
        </v-text-field>
      </div>
      <div style="width: 100%; display: flex; flex-wrap: wrap">
        <legend style="width: 50%">Dane dotyczace Nauczyciela:</legend>
        <legend style="width: 50%">Dane dotyczace klasy:</legend>
        <v-text-field v-for="(schoolClass, index) in schoolClasses" :key="index" readonly>
        <div style="width: 50%; display: flex; flex-wrap: wrap">
          <strong>Tytuł: &nbsp;</strong> {{ schoolClass.title.name }} &nbsp;
          <strong>Imie: &nbsp;</strong>{{ schoolClass.firstname }} &nbsp;
          <strong>Nazwisko: &nbsp;</strong>{{ schoolClass.lastname }} &nbsp;
        </div>
        <div style="width: 50%; display: flex; flex-wrap: wrap">
          <strong>Nazwa klasy: &nbsp;</strong> {{ schoolClass.name }} &nbsp;
          <strong>Ilość uczniów: &nbsp;</strong>{{ schoolClass.students }} &nbsp;
          <strong>Język: &nbsp;</strong>{{ schoolClass.language.name }} &nbsp;
        </div>
        </v-text-field>
      </div>
    </v-Form>
  </div>
</template>
<style></style>
