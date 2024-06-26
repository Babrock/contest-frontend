<script>
import {Form, Field, ErrorMessage} from "vee-validate";
import html2pdf, {f} from 'html2pdf.js';

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
      cityRules: [(v) => !!v || "Miasto jest wymagane"],
      nameRules: [(v) => !!v || "Nazwa szkoły jest wymagana"],
      schoolComplexRules: [(v) => !!v || "Zespół szkół jest wymagany"],
      schoolTypesRules: [(v) => !!v || "Typ szkoły jest wymagany"],
      phoneRules: [(v) => !!v || "Numer telefonu jest wymagany"],
      emailRules: [(v) => !!v || "E-mail jest wymagany", (v) => /.+@.+\..+/.test(v) || "Wprowadź poprawny adres e-mail"],
      addressRules: [(v) => !!v || "Nr budynku"],
      postRules: [(v) => !!v || "Miejscowość jest wymagana"],
      zipCodeRules: [(v) => !!v || "Kod pocztowy jest wymagany"],
      schoolClassNameRules: [(v) => !!v || "Nazwa klasy jest wymagana"],
      schoolClassstudentsRules: [(v) => !!v || "Ilość uczniów jest wymagana"], isFormValid: false,
      titleRules: [(v) => !!v || "Tytuł jest wymagany"],
      schoolClassNumberRules: [(v) => !!v || "Numer klasy jest wymagany"],
      shouldShowSignature: false,
      valid: false,
      hasPreviewed: false,
      dialogAccept: false,
      snackbar: false,
      snackbarMessage: "",
      regions: [],
      voivodeships: [],
      counties: [],
      communities: [],
      cities: [],
      schools: [],
      schoolTypes: [],
      schoolClassNumbers: [],
      schoolsDictionary: [],
      categories: [],
      titles: [],
      languages: [],
      formResponse: [],
      coordinator: {
        title: null,
        role: 2,
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        wantsToRate: 0,
      },
      form: {
        schoolData: {
          voivodeship: null,
          county: null,
          community: null,
          city: null,
          school: null,

          phone: "",
          email: "",
          street: "",
          address: "",
          apartmentNumber: "",
          zipCode: "",
          post: "",
        },
        schoolDetailsInfo: {
          region: null,
          schoolComplex: "",
          headmaster: {
            title: null,
            firstname: "",
            lastname: "",
            email: "",
          },
        },
        schoolClasses: [
          {
            title: {id: null},
            firstname: "",
            lastname: "",
            schoolClassNumber: {id: null},
            name: "",
            students: null,
            language: {id: null},
          },
        ],
        formPdf: null,
      },
    };
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/regions`).then((response) => {
      this.regions = response.data;
    });
    this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
      this.voivodeships = response.data;
    });
    this.axios.get(`http://localhost:8080/categories`).then((response) => {
      this.categories = response.data;
    });
    this.axios.get(`http://localhost:8080/titles`).then((response) => {
      this.titles = response.data;
    });
    this.axios.get(`http://localhost:8080/languages`).then((response) => {
      this.languages = response.data;
    });
    this.getUserDetails();
  },
  watch: {
    '$refs.form.formData': {
      handler: 'validate',
      deep: true,
    },
    "form.schoolData.voivodeship"(value) {
      if (value === null) return;
      this.axios
          .get(`http://localhost:8080/counties?voivodeship=${value}`)
          .then((response) => {
            this.counties = response.data;
          });
    },
    "form.schoolData.county"(value) {
      if (value === null) return;
      this.axios
          .get(`http://localhost:8080/communities?county=${value}`)
          .then((response) => {
            this.communities = response.data;
          });
    },
    "form.schoolData.community"(value) {
      if (value === null) return;
      this.axios
          .get(`http://localhost:8080/cities?community=${value}`)
          .then((response) => {
            this.cities = response.data;
          });
    },
    "form.schoolData.city"(value) {
      if (value === null) return;
      this.axios
          .get(`http://localhost:8080/schools?city=${value}`)
          .then((response) => {
            this.schools = response.data;
          });
    },
    "form.schoolDetailsInfo.category"(value) {
      if (value === null) return;
      this.axios
          .get(`http://localhost:8080/school-types/${value}`)
          .then((response) => {
            this.schoolTypes = response.data;
          });
    },
    "form.schoolDetailsInfo.schoolType"(value) {
      if (value === null) return;
      this.axios
          .get(`http://localhost:8080/class-numbers/${value}`)
          .then((response) => {
            this.schoolClassNumbers = response.data;
          });
    },
  },
  methods: {
    clearCounty() {
      this.form.schoolData.county = null;
      this.clearCommunity()
    },
    clearCommunity() {
      this.form.schoolData.community = null;
      this.clearCity()
    },
    clearCity() {
      this.form.schoolData.city = null;
      this.clearSchool()
    },
    clearSchool() {
      this.form.schoolData.school = null;
    },
    updateSchoolData(id) {
      this.getSchoolDetails(id);
      this.validate();
    },
    countiesDisabled() {
      return this.voivodeships.length < 1 || !this.form.schoolData.voivodeship
    },
    communitiesDisabled() {
      return this.counties.length < 1 || !this.form.schoolData.county
    },
    citiesDisabled() {
      return this.communities.length < 1 || !this.form.schoolData.community
    },
    schoolsDisabled() {
      return this.cities.length < 1 || !this.form.schoolData.city
    },
    preview() {
      this.hasPreviewed = true; // Ustawienie na true po zobaczeniu podglądu
      window.print(); // Wywołanie funkcji print
    },
    saveAsPDF(formResponse) {
      const element = this.$refs.form;
      const options = {
        margin: 5,
        filename: `FormularzZgłoszeniowy_${formResponse.combinedInfo}.pdf`,
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 2},
        jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
      };
      html2pdf().from(element).set(options).output('blob').then((pdfBlob) => {
        // Przekształcenie Blob na base64
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = () => {
          const base64data = reader.result.split(',')[1]; // Pobieranie części base64 z Data URL
          this.form.formPdf = base64data;

          // Wywołanie funkcji onSubmit po konwersji PDF na base64
          this.onSubmit();
        };
      }).catch((error) => {
        console.error('Błąd podczas generowania PDF-a:', error);
      });
    },
    print() {
      this.shouldShowSignature = true;
      window.print();
      this.shouldShowSignature = false;
    },
    saveAndDownload() {
      this.dialogAccept = true;
    },
    onSubmit() {
      this.axios
          .post("http://localhost:8080/form", this.form)
          .then((response) => {
            this.snackbarMessage = ("Formularz został zgłoszony.")
            this.formResponse = response.data
            this.snackbar = true
          })
          .catch((err) => {
            this.snackbarMessage = ("Wystąpił nieoczekiwany błąd.")
            this.snackbar = true
          });
      this.dialogAccept = false
    },
    async validate() {
      const {valid} = await this.$refs.form.validate();
      this.valid = valid;
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    getSchoolDetails(id) {
      this.axios.get(`http://localhost:8080/schools/${id}`).then((response) => {
        let data = response.data
        this.form.schoolData.phone = data.phone
        this.form.schoolData.email = data.email
        this.form.schoolData.street = data.street
        this.form.schoolData.address = data.address
        this.form.schoolData.apartmentNumber = data.apartmentNumber
        this.form.schoolData.zipCode = data.zipCode
        this.form.schoolData.post = data.post
        var fullName = data.headmasterFullName
        var nameParts = fullName.split(" ")
        this.form.schoolDetailsInfo.headmaster.firstname = nameParts[0]
        this.form.schoolDetailsInfo.headmaster.lastname = nameParts.slice(1).join(" ")
      });
    },
    getUserDetails() {
      this.axios.get(`http://localhost:8080/users/details`).then((response) => {
        let data = response.data
        this.coordinator.title = data.title
        this.coordinator.firstname = data.firstname
        this.coordinator.lastname = data.lastname
        this.coordinator.phone = data.phone
        this.coordinator.email = data.email
      });
    },
    addSchoolClass() {
      const schoolClass = {
        title: {id: null},
        firstname: "",
        lastname: "",
        schoolClassNumber: {id: null},
        name: "",
        students: null,
        language: {id: null},
      };
      this.form.schoolClasses.push(schoolClass);
    },
    deleteSchoolClass() {
      if (this.form.schoolClasses.length > 1) {
        this.form.schoolClasses.pop();
      } else {
        this.snackbarMessage = ("W zgłoszeniu musi być podana co najmniej jedna klasa!")
        this.snackbar = true
      }
    },
  },
};
</script>

<template>
  <div class="d-flex bg-white pa-1 pa-sm-5">
    <v-Form ref="form" @input="validate" @submit.prevent="onSubmit">
      <h2 v-if="formResponse">
        Formularz Zgłoszeniowy {{ formResponse.combinedInfo }}
      </h2>
      <div>
        <v-select
            v-model="form.schoolDetailsInfo.region"
            :items="regions"
            item-value="id"
            item-title="name"
            label="Region"
            :rules="[(v) => !!v || 'Region jest wymagany']"
            required
        ></v-select>
        <legend>Dane Szkoły:</legend>
        <div class="d-flex flex-column flex-sm-row ga-sm-1">
          <v-select
              v-model="form.schoolData.voivodeship"
              @update:modelValue="clearCounty"
              :disabled="voivodeships.length < 1"
              :items="voivodeships"
              item-value="id"
              item-title="name"
              label="Województwo"
              :rules="[(v) => !!v || 'Województwo jest wymagane']"
              required
          ></v-select>
          <v-select
              v-model="form.schoolData.county"
              @update:modelValue="clearCommunity"
              :disabled="countiesDisabled()"
              :items="counties"
              item-value="id"
              item-title="name"
              label="Powiat"
              :rules="[(v) => !!v || 'Powiat jest wymagany']"
              required
          ></v-select>
          <v-autocomplete
              v-model="form.schoolData.community"
              @update:modelValue="clearCity"
              :disabled="communitiesDisabled()"
              :items="communities"
              item-value="id"
              item-title="name"
              label="Gmina"
              :rules="[(v) => !!v || 'Gmina jest wymagana']"
              required
          ></v-autocomplete>
          <v-autocomplete
              v-model="form.schoolData.city"
              @update:modelValue="clearSchool"
              :disabled="citiesDisabled()"
              :items="cities"
              item-value="id"
              item-title="name"
              label="Miasto"
              :rules="cityRules"
              required
          ></v-autocomplete>
        </div>
        <v-autocomplete
            v-model="form.schoolData.school"
            @update:modelValue="updateSchoolData"
            :disabled="schoolsDisabled()"
            :items="schools"
            item-value="id"
            item-title="name"
            :rules="nameRules"
            label="Nazwa szkoły"
            required
        ></v-autocomplete>
        <div class="d-flex flex-column flex-sm-row ga-sm-1">
          <div class="w-sm-15">
            <v-select
                @update:modelValue="form.schoolDetailsInfo.schoolType = null"
                v-model="form.schoolDetailsInfo.category"
                :items="categories"
                item-value="id"
                item-title="name"
                label="Kategoria"
                :rules="[(v) => !!v || 'Kategoria jest wymagana']"
                required
            ></v-select>
          </div>
          <v-text-field
              class="w-sm-15"
              v-model="form.schoolDetailsInfo.schoolComplex"
              :rules="schoolComplexRules"
              label="Zespół szkół"
              required
          ></v-text-field>
          <v-select
              class="w-sm-1"
              @update:modelValue="validate"
              v-model="form.schoolDetailsInfo.schoolType"
              :disabled="schoolTypes.length < 1"
              :items="schoolTypes"
              item-value="id"
              item-title="name"
              :rules="schoolTypesRules"
              label="Typ szkoły"
              required
          ></v-select>
          <v-text-field
              class="w-sm-6"
              v-model="form.schoolData.phone"
              readonly
              :rules="phoneRules"
              label="Numer telefonu"
              placeholder="+48 000 000 000"
              required
          ></v-text-field>
          <v-text-field
              class="w-sm-20"
              v-model="form.schoolData.email"
              :rules="emailRules"
              label="E-mail"
              placeholder="adres@poczta.pl"
              required
              readonly
          ></v-text-field>
        </div>
        <div class="d-flex flex-column flex-sm-row ga-sm-1">

        </div>
        <legend>
          Dokładny adres szkoły (tak jak na kopercie, bez nazwy szkoły):
        </legend>
        <div class="d-flex flex-column flex-sm-row ga-sm-1">
          <v-text-field
              class="w-sm-5"
              v-model="form.schoolData.street"
              label="Ulica"
              readonly
          ></v-text-field>
          <div class="d-flex flex-row flex-sm-row ga-sm-1 w-sm-75">
            <v-text-field
                class="w-sm-20"
                v-model="form.schoolData.address"
                :rules="addressRules"
                label="Nr budynku"
                required
                readonly
            ></v-text-field>
            <v-text-field
                class="w-sm-20"
                v-model="form.schoolData.apartmentNumber"
                label="Nr lokalu"
                required
                readonly
            ></v-text-field>
            <v-text-field
                class="w-sm-20"
                v-model="form.schoolData.zipCode"
                :rules="zipCodeRules"
                label="Kod pocztowy"
                required
                placeholder="00-000"
                readonly
            ></v-text-field>
            <v-text-field
                class="w-sm-40"
                v-model="form.schoolData.post"
                :rules="postRules"
                label="Miejscowość"
                required
                readonly
            ></v-text-field>
          </div>
        </div>
      </div>

      <div>
        <legend>Dane Dyrektora Szkoły:</legend>
        <div class="d-flex flex-column flex-sm-row ga-sm-1">
          <div class="w-sm-10">
            <v-select
                @update:modelValue="validate"
                v-model="form.schoolDetailsInfo.headmaster.title"
                :rules="titleRules"
                :items="titles"
                item-value="id"
                item-title="name"
                label="Tytuł"
                required
            ></v-select>
          </div>
          <div class="d-flex flex-row flex-sm-row ga-sm-1 w-sm-50">
            <v-text-field
                class="w-sm-50"
                :rules="firstnameRules"
                v-model="form.schoolDetailsInfo.headmaster.firstname"
                label="Imię"
                required
            ></v-text-field>
            <v-text-field
                class="w-sm-50"
                v-model="form.schoolDetailsInfo.headmaster.lastname"
                :rules="lastnameRules"
                label="Nazwisko"
                required
            ></v-text-field>
          </div>
          <v-text-field
              class="w-sm-20"
              v-model="form.schoolDetailsInfo.headmaster.email"
              :rules="emailRules"
              label="E-mail"
              placeholder="adres@strona.pl"
              required
          ></v-text-field>
        </div>
      </div>
      <div>
        <legend>
          Dane dotyczace Nauczyciela koordynujacego przebieg konkursu w szkole:
        </legend>
        <div class="d-flex flex-column flex-sm-row ga-sm-1">
          <div class="w-sm-10">
            <v-select
                v-model="coordinator.title"
                :items="titles"
                :rules="titleRules"
                item-value="id"
                item-title="name"
                label="Tytuł"
                required
                readonly
            ></v-select>
          </div>
          <div class="d-flex flex-row flex-sm-row ga-sm-1 w-sm-50">
            <v-text-field
                class="w-sm-50"
                :rules="firstnameRules"
                v-model="coordinator.firstname"
                label="Imię"
                required
                readonly
            ></v-text-field>
            <v-text-field
                class="w-sm-50"
                v-model="coordinator.lastname"
                :rules="lastnameRules"
                label="Nazwisko"
                required
                readonly
            ></v-text-field>
          </div>
          <v-text-field
              class="w-sm-20"
              v-model="coordinator.email"
              :rules="emailRules"
              label="E-mail"
              type="email"
              placeholder="adres@strona.pl"
              required
              readonly
          ></v-text-field>
          <v-text-field
              class="w-sm-0"
              v-model="coordinator.phone"
              :rules="phoneRules"
              label="Telefon"
              placeholder="+48 000 000 000"
              required
              :maxlength="9"
          ></v-text-field>
        </div>
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
            v-model="coordinator.wantsToRate"
        ></v-checkbox>
      </div>
      <div class="d-flex flex-column flex-sm-row ga-sm-1">
        <legend>Dane dotyczace Nauczyciela:</legend>
        <legend>Dane dotyczace klasy:</legend>
        <v-btn @click="addSchoolClass()">Dodaj klasę</v-btn>
        <v-btn @click="deleteSchoolClass()">Usuń ostatnią klasę</v-btn>
      </div>
      <v-list>
        <v-list-item v-for="(schoolClass) in form.schoolClasses">
          <div class="d-flex flex-column flex-sm-row ga-sm-1">
            <div class="w-sm-10">
              <v-select
                  @update:modelValue="validate"
                  v-model="schoolClass.title.id"
                  :items="titles"
                  :rules="titleRules"
                  item-value="id"
                  item-title="name"
                  label="Tytuł"
                  required
              ></v-select>
            </div>
            <div class="d-flex flex-row flex-sm-row ga-sm-1 w-sm-50 h-100">
              <v-text-field
                  class="w-sm-50"
                  :rules="firstnameRules"
                  v-model="schoolClass.firstname"
                  label="Imię"
                  required
              ></v-text-field>
              <v-text-field
                  class="w-sm-50"
                  v-model="schoolClass.lastname"
                  :rules="lastnameRules"
                  label="Nazwisko"
                  required
              ></v-text-field>
            </div>
            <div class="d-flex flex-row flex-sm-row ga-sm-1 w-sm-10">
              <v-select
                  @update:modelValue="validate"
                  v-model="schoolClass.schoolClassNumber.id"
                  :disabled="schoolClassNumbers.length < 1"
                  :items="schoolClassNumbers"
                  item-value="id"
                  item-title="name"
                  :rules="schoolClassNumberRules"
                  label="Numer Klasy"
                  required
              ></v-select>
            </div>
            <v-text-field
                class="w-sm-0"
                v-model="schoolClass.name"
                :rules="schoolClassNameRules"
                label="Nazwa klasy"
                required
            ></v-text-field>
            <v-text-field
                class="w-sm-0"
                v-model="schoolClass.students"
                :rules="schoolClassstudentsRules"
                label="Ilość uczniów"
                required
                type="number"
                min="0"
                max="100"
            ></v-text-field>
            <v-select
                class="w-sm-0"
                @update:modelValue="validate"
                v-model="schoolClass.language.id"
                :items="languages"
                :rules="[(v) => !!v || 'Język jest wymagany']"
                item-value="id"
                item-title="name"
                label="Język"
                required
            ></v-select>
          </div>
        </v-list-item>
      </v-list>
      <small class="visible-on-print" :class="{ 'visible-on-print': shouldShowSignature }">
        <hr>
        Data i podpis Dyrektora szkoły </small>
      <div class="w-100 d-flex flex-column flex-sm-row ga-1">
        <v-btn style="height: 50px" class="flex-grow-1" color="error" @click="reset"> Wyczyść formularz</v-btn>
        <v-btn style="height: 50px" class="flex-grow-1" color="blue" @click="preview">Zobacz podgląd
          <div class="sub-text">(zobacz podgląd aby móc zapisać i pobrać)</div>
        </v-btn>
        <v-btn style="height: 50px" class="flex-grow-1" color="success" @click="saveAndDownload" :disabled="!valid || !hasPreviewed">Zapisz i pobierz
          <div class="sub-text">(plik do wydruku zapisał się do pobranych)</div>
        </v-btn>
        <v-btn @click="saveAsPDF" >savePdf</v-btn>
      </div>
      <v-dialog
          v-model="dialogAccept"
          max-width="500"
          persistent
      >
        <v-card>
          <v-card-title class="headline">
            Czy potwierdzasz zgodność danych?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialogAccept = false">Anuluj</v-btn>
            <v-btn @click="onSubmit">Potwierdź</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar" :timeout="3000">{{ snackbarMessage }}</v-snackbar>
    </v-Form>
  </div>
</template>

<style>
.sub-text {
  position: absolute;
  top: 80%;
  font-size: 90%; /* Adjust the font size as needed */
  color: rgb(0, 0, 0); /* Adjust the color as needed */
}

hr {
  border: none;
  border-top: 1px dotted rgb(0, 0, 0);
  color: #fff;
  background-color: #fff;
  height: 1px;
  margin-top: 40px;
}

.visible-on-print {
  display: none;
  margin-left: 70%;
}

@media print {
  .v-app-bar,
  .v-btn,
  .v-field__append-inner,
  .v-input__details {
    display: none;
  }

  .visible-on-print {
    display: block;
  }

  #labelPrintSize {
    font-size: 10px;
  }

  @page {
    margin: 0;
    background: none;
  }

}
</style>
