<script>
import {toHandlers} from 'vue';
import {useAuthStore} from '../store/auth.js'
import {mapWritableState, mapState} from 'pinia'

export default {
  data() {
    return {
      dialogAccept: false,
      snackbar: false,
      snackbarMessage: "",
      form: {
        id: "",
      },
      school: {
        name: "",
        city: "",
        community: "",
        county: "",
        voivodeship: "",
        address: "",
        apartmentNumber: "",
        email: "",
        phone: "",
        street: "",
        post: "",
        zipCode: "",
      },
      schoolDetails: {
        region: "",
        category: "",
        schoolComplex: "",
        schoolType: "",
        email: "",
        title: "",
        firstname: "",
        lastname: "",
      },
      user: {
        title: "",
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
      },
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
      },
      userKeyNames: {
        title: "Tytuł",
        firstname: "Imie",
        lastname: "Nazwisko",
        email: "E-mail",
        phone: "Telefon",
        wantsToRate: "Chęć udziału Koordynatora w pracach Komisji Sprawdzającej",
      },
    };
  },
  computed: {
    ...mapWritableState(useAuthStore, ['isAuthenticated']),
    ...mapState(useAuthStore, ['role'])
  },
  methods: {
    onSubmit() {
      let match = this.form.id.match(/\b\d+\b/);
      let formNumber = this.form.id
      this.form.id = match[0];
      this.axios.all([
        this.axios.get(`http://localhost:8080/form/combinedInfo/${formNumber}`),
        this.axios.get(`http://localhost:8080/classes?form_id=${this.form.id}`)
      ]).then((responses) => {
        const [formResponse, classesResponse] = responses
        let dataFormResposne = formResponse.data
        this.schoolClasses = classesResponse.data
        this.school.voivodeship = dataFormResposne.school.city.community.county.voivodeship.name
        this.school.county = dataFormResposne.school.city.community.county.name
        this.school.community = dataFormResposne.school.city.community.name
        this.school.city = dataFormResposne.school.name

        this.school.name = dataFormResposne.school.name
        this.school.street = dataFormResposne.school.street
        this.school.address = dataFormResposne.school.address
        this.school.apartmentNumber = dataFormResposne.school.apartmentNumber
        this.school.zipCode = dataFormResposne.school.zipCode
        this.school.post = dataFormResposne.school.post
        this.school.phone = dataFormResposne.school.phone
        this.school.email = dataFormResposne.school.email

        this.schoolDetails.region = dataFormResposne.schoolDetails.region
        this.schoolDetails.category = classesResponse.data[0].schoolClassNumber.schoolType.category.name
        this.schoolDetails.schoolComplex = dataFormResposne.schoolDetails.schoolComplex
        this.schoolDetails.schoolType = classesResponse.data[0].schoolClassNumber.schoolType.name

        this.schoolDetails.title = dataFormResposne.schoolDetails.title
        this.schoolDetails.firstname = dataFormResposne.schoolDetails.firstname
        this.schoolDetails.lastname = dataFormResposne.schoolDetails.lastname
        this.schoolDetails.email = dataFormResposne.schoolDetails.email

        this.user.title = dataFormResposne.user.title
        this.user.firstname = dataFormResposne.user.firstname
        this.user.lastname = dataFormResposne.user.lastname
        this.user.email = dataFormResposne.user.email
        this.user.phone = dataFormResposne.user.phone
        this.user.wantsToRate = dataFormResposne.user.wantsToRate
      })
          .catch((error) => {
            this.snackbarMessage = ("Nie ma takiego formularza!")
            this.snackbar = true
          });
    },
    accept() {
      this.axios.post(`http://localhost:8080/form/accepted/${this.form.id}`)
          .then((response) => {
            this.snackbarMessage = ("Formularz został zaakceptowany.")
            this.snackbar = true
          })
          .catch((err) => {
            this.snackbarMessage = ("Wystąpił nieoczekiwany błąd.")
            this.snackbar = true
          });
      this.dialogAccept = false
    },
    withdraw() {
      this.axios.post(`http://localhost:8080/form/not-accepted/${this.form.id}`)
          .then((response) => {
            alert("Formularz został wycofany.");
          })
          .catch((err) => {
            alert("Wystąpił nieoczekiwany błąd.");
          });
    },
    deleteForm() {
      this.axios.delete(`http://localhost:8080/form/${this.form.id}`)
          .then((response) => {
            alert("Formularz został Usunięty.");
          })
          .catch((err) => {
            alert("Wystąpił nieoczekiwany błąd.");
          });
    },
  },
};
</script>

<template>
  <div class="d-flex bg-white">
    <v-Form ref="form" @submit.prevent="onSubmit">
      <h2>Akceptacja formularza</h2>
      <v-text-field
          v-model="form.id"
          label="Kod formularza"
          type="text"
          required
      ></v-text-field>
      <div class="w-100 d-flex flex-column flex-md-row ga-1">
        <v-btn class="flex-grow-1" color="grey" type="submit">Pobierz formularz</v-btn>
        <v-dialog
            v-model="dialogAccept"
            max-width="500"
            persistent
        >
          <v-card  title="Czy na pewno chcesz zaakceptować formularz?" >
            <template v-slot:actions>
              <v-spacer></v-spacer>
              <v-btn @click="dialogAccept = false"> Anuluj</v-btn>
              <v-btn @click="accept"> Potwierdź</v-btn>
            </template>
          </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :timeout="5000" >{{ snackbarMessage }}</v-snackbar>
        <v-btn class="flex-grow-1" color="success" @click="dialogAccept=true">Akceptuj formularz</v-btn>
        <v-btn class="flex-grow-1" color="warning" @click="withdraw">Wycofaj formularz</v-btn>
        <v-btn class="flex-grow-1" v-if="role=='ROLE_ADMIN'" color="error" @click="deleteForm">Usuń formularz</v-btn>
      </div>
      <v-text-field readonly v-model="schoolDetails.region.name" label="Region"></v-text-field>
      <legend>Dane Szkoły:</legend>
      <div class="d-flex flex-column flex-md-row">
        <v-text-field readonly v-model="school.voivodeship" label="Województwo"></v-text-field>
        <v-text-field readonly v-model="school.county" label="Powiat"></v-text-field>
        <v-text-field readonly v-model="school.community" label="Gmina"></v-text-field>
        <v-text-field readonly v-model="school.city" label="Miasto"></v-text-field>
      </div>
      <div>
        <v-text-field readonly v-model="school.name" label="Nazwa Szkoły"></v-text-field>
      </div>
      <div class="d-flex flex-column flex-md-row">
        <v-text-field readonly v-model="schoolDetails.category.name" label="Kategoria"></v-text-field>
        <v-text-field readonly v-model="schoolDetails.schoolComplex" label="Zespół Szkół"></v-text-field>
        <v-text-field readonly v-model="schoolDetails.schoolType.name" label="Typ Szkoły"></v-text-field>
      </div>
      <div class="d-flex flex-column flex-md-row">
        <v-text-field readonly v-model="school.email" label="E-mail"></v-text-field>
        <v-text-field readonly v-model="school.phone" label="Telefon"></v-text-field>
      </div>
      <legend>Dokładny adres szkoły (tak jak na kopercie, bez nazwy szkoły):</legend>
      <div class="d-flex flex-column flex-md-row">
        <v-text-field readonly v-model="school.street" label="Ulica"></v-text-field>
        <v-text-field readonly v-model="school.address" label="Numer budynku"></v-text-field>
        <v-text-field readonly v-model="school.apartmentNumber" label="Numer lokalu"></v-text-field>
        <v-text-field readonly v-model="school.zipCode" label="Kod pocztowy"></v-text-field>
        <v-text-field readonly v-model="school.post" label="Miejscowośc"></v-text-field>
      </div>
      <legend>Dane Dyrektora Szkoły:</legend>
      <div class="d-flex flex-column flex-md-row">
        <v-text-field readonly v-model="schoolDetails.title.name" label="Tytuł"></v-text-field>
        <v-text-field readonly v-model="schoolDetails.firstname" label="Imie"></v-text-field>
        <v-text-field readonly v-model="schoolDetails.lastname" label="Nazwisko"></v-text-field>
        <v-text-field readonly v-model="schoolDetails.email" label="Email"></v-text-field>
      </div>
      <legend>Dane dotyczace Nauczyciela koordynujacego przebieg konkursu w szkole:</legend>
      <div class="d-flex flex-column flex-md-row">
        <v-text-field readonly v-model="user.title.name" label="Tytuł"></v-text-field>
        <v-text-field readonly v-model="user.firstname" label="Imie"></v-text-field>
        <v-text-field readonly v-model="user.lastname" label="Nazwisko"></v-text-field>
      </div>
      <div class="d-flex flex-column flex-md-row">
        <v-text-field readonly v-model="user.email" label="Email"></v-text-field>
        <v-text-field readonly v-model="user.phone" label="Telefon"></v-text-field>
      </div>
      <label
      >Poniższe pole jest zaznaczone w przypadku chęci udziału
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
          v-model="user.wantsToRate"
          readonly
          disabled
      ></v-checkbox>
      <div class="d-flex flex-column flex-md-row">
        <legend>Dane dotyczace Nauczyciela:</legend>
        <legend>Dane dotyczace klasy:</legend>
      </div>
      <div class="w- d-flex flex-wrap flex-column flex-md-row" v-for="(schoolClass, index) in schoolClasses" :key="index" readonly>
        <v-text-field class="flex-grow-1" readonly v-model="schoolClass.title.name" label="Tytuł"></v-text-field>
        <v-text-field class="flex-grow-1" readonly v-model="schoolClass.firstname" label="Imie"></v-text-field>
        <v-text-field class="flex-grow-1" readonly v-model="schoolClass.lastname" label="Nazwisko"></v-text-field>
        <v-text-field class="flex-grow-1" readonly v-model="schoolClass.schoolClassNumber.name" label="Numer klasy"></v-text-field>
        <v-text-field class="flex-grow-1" readonly v-model="schoolClass.name" label="Nazwa klasy"></v-text-field>
        <v-text-field class="flex-grow-1" readonly v-model="schoolClass.students" label="Ilość uczniów"></v-text-field>
        <v-text-field class="flex-grow-1" readonly v-model="schoolClass.language.name" label="Język"></v-text-field>
      </div>
    </v-Form>
  </div>
</template>
<style>
@media screen and (max-width: 600px) {
  .flex-column flex-md-row {
    flex-direction: column;
  }
}
</style>
