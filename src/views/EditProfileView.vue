<script>
import { toHandlers } from 'vue';
import { useAuthStore } from '../store/auth.js'
import { mapWritableState, mapState } from 'pinia'
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
      },
      schoolDetails:{
        category: "",
        schoolComplex:"",
        schoolType:"",
        email:"",
        title:"",
        firstname:"",
        lastname:"",
      },
      user: {
        title:"",
        firstname:"",
        lastname:"",
        email:"",
        phone:"",
      },
      schoolClasses: {
      },
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
      if (this.form.id == null) {
        window.alert("Nie wprowadziłeś numeru formularzu");
        return;
      }
      this.axios.all([
        this.axios.get(`http://localhost:8080/form/${this.form.id}`),
        this.axios.get(`http://localhost:8080/classes?form_id=${this.form.id}`)
        ]).then((responses) => {
          const [formResponse, classesResponse] = responses;
          let dataFormResposne = formResponse.data
          this.schoolClasses = classesResponse.data

          this.school.voivodeship = dataFormResposne.school.voivodeship
          this.school.county = dataFormResposne.school.county
          this.school.community = dataFormResposne.school.community
          this.school.city = dataFormResposne.school.city
          this.school.name = dataFormResposne.school.name
          this.school.street = dataFormResposne.school.street
          this.school.address = dataFormResposne.school.address
          this.school.apartmentNumber = dataFormResposne.school.apartmentNumber
          this.school.zipCode = dataFormResposne.school.zipCode
          this.school.post = dataFormResposne.school.post
          this.school.phone = dataFormResposne.school.phone
          this.school.email = dataFormResposne.school.email

          this.schoolDetails.category = dataFormResposne.schoolDetails.category
          this.schoolDetails.schoolComplex = dataFormResposne.schoolDetails.schoolComplex
          this.schoolDetails.schoolType = dataFormResposne.schoolDetails.schoolType

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
          window.alert("Nie ma takiego formularza!");
        });
    },
    accepted(){
      this.axios.post(`http://localhost:8080/form/accepted/${this.form.id}`)
      .then((response) => {
        alert("Formularz został zaakceptowany.");
      })
      .catch((err) => {
        alert("Wystąpił nieoczekiwany błąd.");
      });
    },
    notAccepted(){
      this.axios.post(`http://localhost:8080/form/not-accepted/${this.form.id}`)
      .then((response) => {
        alert("Formularz został wycofany.");
      })
      .catch((err) => {
        alert("Wystąpił nieoczekiwany błąd.");
      });
    },
    deleteForm(){
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
  <div class="pageA4">
    <v-Form ref="form" @submit.prevent="onSubmit">
      <h2 style="text-align: center; margin-top: 0.5%; background-color: rgb(var(--v-theme-on-surface-variant));">Akceptacja formularza</h2>
      <v-text-field
        v-model="form.id"
        label="Kod formularza"
        type="number"
        min="0"
        required
      ></v-text-field>
      <div style="width: 100%; display: flex; justify-content: space-between">
        <v-btn color="grey" type="submit">Pobierz formularz</v-btn>
        <v-btn color="success" @click="accepted">Akceptuj formularz</v-btn>
        <v-btn color="warning" @click="notAccepted">Wycofaj formularz</v-btn>
        <v-btn v-if="role=='ROLE_ADMIN'" color="error" @click="deleteForm" >Usuń formularz</v-btn>
      </div>
      <div class="mt-4" style="width: 100%; display: flex; flex-wrap: wrap">
        <legend>Dane Szkoły:</legend>
        <v-text-field readonly v-model="school.voivodeship" label="Województwo"></v-text-field>
        <v-text-field readonly v-model="school.county" label="Powiat"></v-text-field>
        <v-text-field readonly v-model="school.community" label="Gmina"></v-text-field>
        <v-text-field readonly v-model="school.city" label="Miasto"></v-text-field>
        <v-text-field style="width: 100%;" readonly v-model="school.name" label="Nazwa Szkoły"></v-text-field>
        <v-text-field readonly v-model="schoolDetails.category.name" label="Kategoria"></v-text-field>
        <v-text-field readonly v-model="schoolDetails.schoolComplex" label="Zespół Szkół"></v-text-field>
        <v-text-field readonly v-model="schoolDetails.schoolType.name" label="Typ Szkoły"></v-text-field>
        <div style="width: 100%; display: flex;">
          <v-text-field readonly v-model="school.email" label="E-mail"></v-text-field>
          <v-text-field readonly v-model="school.phone" label="Telefon"></v-text-field>
        </div>
        <legend>Dokładny adres szkoły (tak jak na kopercie, bez nazwy szkoły):</legend>
        <v-text-field readonly v-model="school.street" label="Ulica"></v-text-field>
        <v-text-field readonly v-model="school.address" label="Numer budynku"></v-text-field>
        <v-text-field readonly v-model="school.apartmentNumber" label="Numer lokalu"></v-text-field>
        <v-text-field readonly v-model="school.zipCode" label="Kod pocztowy"></v-text-field>
        <v-text-field readonly v-model="school.post" label="Miejscowośc"></v-text-field>
        <legend >Dane Dyrektora Szkoły:</legend>
        <v-text-field readonly v-model="schoolDetails.title.name" label="Tytuł"></v-text-field>
        <v-text-field readonly v-model="schoolDetails.firstname" label="Imie"></v-text-field>
        <v-text-field readonly v-model="schoolDetails.lastname" label="Nazwisko"></v-text-field>
        <v-text-field readonly v-model="schoolDetails.email" label="Email"></v-text-field>
      </div>
      <div style="width: 100%; display: flex; flex-wrap: wrap">
        <legend>Dane dotyczace Nauczyciela koordynujacego przebieg konkursu w szkole:</legend>
        <v-text-field readonly v-model="user.title.name" label="Tytuł"></v-text-field>
        <v-text-field readonly v-model="user.firstname" label="Imie"></v-text-field>
        <v-text-field readonly v-model="user.lastname" label="Nazwisko"></v-text-field>
        <div style="width: 100%; display: flex;">
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
            style="--v-input-control-height: 0px; height: 30px; margin-top: -1%"
            v-model="user.wantsToRate"
            readonly
            disabled
        ></v-checkbox>
      </div>
      <div style="width: 100%; display: flex; flex-wrap: wrap">
        <legend style="width: 50%">Dane dotyczace Nauczyciela:</legend>
        <legend style="width: 50%">Dane dotyczace klasy:</legend>
        <div style="width: 100%; display: flex; flex-wrap: wrap" v-for="(schoolClass, index) in schoolClasses" :key="index" readonly>
          <v-text-field readonly v-model="schoolClass.title.name" label="Tytuł"></v-text-field>
          <v-text-field readonly v-model="schoolClass.firstname" label="Imie"></v-text-field>
          <v-text-field readonly v-model="schoolClass.lastname" label="Nazwisko"></v-text-field>
          <v-text-field readonly v-model="schoolClass.name" label="Nazwa klasy"></v-text-field>
          <v-text-field readonly v-model="schoolClass.students" label="Ilość uczniów"></v-text-field>
          <v-text-field readonly v-model="schoolClass.language.name" label="Język"></v-text-field>
        </div>
      </div>
    </v-Form>
  </div>
</template>
<style></style>
