<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import html2pdf, { f } from 'html2pdf.js';
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
      shouldShowSignature: false,
      valid: false,
      regions:[],
      voivodeships: [],
      counties: [],
      communities: [],
      cities: [],
      schools: [],
      schoolTypes: [],
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
          category: null,
          schoolComplex: "",
          schoolType: null,
          headmaster: {
            title: null,
            firstname: "",
            lastname: "",
            email: "",
          },
        },
        schoolClasses: [
           {
            title: null,
            firstname: "",
            lastname: "",
            name: "",
            students: null,
            language: null,
          },
        ],
      },
    };
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/regions`).then((response) => {
      this.regions = response.data;
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
    this.axios.get(`http://localhost:8080/school-types`).then((response) => {
      this.schoolTypes = response.data;
    });
  },
  watch: {
    '$refs.form.formData': {
      handler: 'validate',
      deep: true,
    },
    "form.schoolDetailsInfo.region"(value) {
      if (value === null) return;
      this.axios
        .get(`http://localhost:8080/counties/region/${value}`)
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
          this.cities = response.data.map(city => city.name);
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
  },
  methods: {
    saveAsPDF(formResponse) {
      const element = this.$refs.form;
      console.log(formResponse.combinedInfo)
      const options = {
        margin: 5,
        filename: `FormularzZgłoszeniowy_${formResponse.combinedInfo}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      html2pdf().from(element).set(options).save();
    },

    print() {
      this.shouldShowSignature = true;
      window.print();
      this.shouldShowSignature = false;
    },

    onSubmit(values) {
      if (window.confirm("Czy potwierdzasz zgodność danych?")) {
        this.axios
          .post("http://localhost:8080/form", this.form)
          .then((response) => {
            alert("Formularz został zgłoszony.");
            this.formResponse = response.data
            this.saveAsPDF(this.formResponse);
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
    getUserDetails(){
      this.axios.get(`http://localhost:8080/users/details`).then((response) => {
        let data = response.data
        this.coordinator.title = data.title
        this.coordinator.firstname = data.firstname
        this.coordinator.lastname = data.lastname
        this.coordinator.phone = data.phone
        this.coordinator.email = data.email
      });
    },
    updateValues(id) {
      this.getSchoolDetails(id);
      this.getUserDetails();
      this.validate();
    },
    addSchoolClass() {
      const schoolClass = {
      };
      this.form.schoolClasses.push(schoolClass);
    },
    deleteSchoolClass() {
      if (this.form.schoolClasses.length > 1) {
        this.form.schoolClasses.pop();
      } else {
        alert("W zgłoszeniu musi być podana co najmniej jedna klasa!");
      }
    },
  },
};
</script>

<template>
  <v-sheet class="mx-auto">
    <div class="pageA4">
      <v-Form ref="form" @input="validate" @submit.prevent="onSubmit">
        <h2 v-if="formResponse" style="text-align: center;margin-top: 0.5%; background-color: rgb(var(--v-theme-on-surface-variant));">
          Formularz Zgłoszeniowy {{ formResponse.combinedInfo }}
        </h2>
        <div>
          <legend>Dane Szkoły:</legend>
          <!-- {{form}} -->
          <div style="width: auto; display: flex">
            <v-select
              v-model="form.schoolDetailsInfo.region"
              @update:modelValue="form.schoolData.voivodeship = null"
              :items="regions"
              item-value="id"
              item-title="name"
              label="Region"
              :rules="[(v) => !!v || 'Region jest wymagany']"
              required
            ></v-select>
            <v-select
              v-model="form.schoolData.county"
              @update:modelValue="form.schoolData.community = null"
              :disabled="counties.length < 1"
              :items="counties"
              item-value="id"
              item-title="name"
              label="Powiat"
              :rules="[(v) => !!v || 'Powiat jest wymagany']"
              required
            ></v-select>
            <v-autocomplete
              v-model="form.schoolData.community"
              @update:modelValue="form.schoolData.city = null"
              :disabled="communities.length < 1"
              :items="communities"
              item-value="id"
              item-title="name"
              label="Gmina"
              :rules="[(v) => !!v || 'Gmina jest wymagana']"
              required
            ></v-autocomplete>
            <v-autocomplete
              v-model="form.schoolData.city"
              @update:modelValue="form.schoolData.school = null"
              :disabled="cities.length < 1"
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
            :disabled="schools.length < 1"
            :items="schools"
            item-value="id"
            item-title="name"
            @update:modelValue="updateValues"
            :rules="nameRules"
            label="Nazwa szkoły"
            required
          ></v-autocomplete>
          <div style="width: 100%; display: flex">
            <v-select
              @update:modelValue="validate"
              v-model="form.schoolDetailsInfo.category"
              :items="categories"
              item-value="id"
              item-title="name"
              label="Kategoria"
              :rules="[(v) => !!v || 'Kategoria jest wymagana']"
              required
            ></v-select>
            <v-text-field
              v-model="form.schoolDetailsInfo.schoolComplex"
              :rules="schoolComplexRules"
              label="Zespół szkół"
              required
            ></v-text-field>
            <v-select
              @update:modelValue="validate"
              v-model="form.schoolDetailsInfo.schoolType"
              :items="schoolTypes"
              item-value="id"
              item-title="name"
              :rules="schoolTypesRules"
              label="Typ szkoły"
              required
            ></v-select>
          </div>
          <div style="display: flex;">
              <v-text-field
              v-model="form.schoolData.phone"
              readonly
              :counter="12"
              :rules="phoneRules"
              label="Numer telefonu"
              placeholder="+48 000 000 000"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.schoolData.email"
              :rules="emailRules"
              readonly
              label="E-mail"
              placeholder="adres@poczta.pl"
              required
            ></v-text-field>
            </div>
          <legend>
            Dokładny adres szkoły (tak jak na kopercie, bez nazwy szkoły):
          </legend>
          <div style="width: 100%; display: flex">
            <v-text-field
              v-model="form.schoolData.street"
              label="Ulica"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.schoolData.address"
              :rules="addressRules"
              label="Nr budynku"
              required
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.schoolData.apartmentNumber"
              label="Nr lokalu"
              required
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.schoolData.zipCode"
              :rules="zipCodeRules"
              label="Kod pocztowy"
              required
              placeholder="00-000"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.schoolData.post"
              :rules="postRules"
              label="Miejscowość"
              required
              readonly
            ></v-text-field>
          </div>
        </div>

        <div>
          <legend>Dane Dyrektora Szkoły:</legend>
          <div style="width: 100%; display: flex">
            <v-select
              class="width20per"
              @update:modelValue="validate"
              v-model="form.schoolDetailsInfo.headmaster.title"
              :rules="titleRules"
              :items="titles"
              item-value="id"
              item-title="name"
              label="Tytuł"
              required
            ></v-select>
            <v-text-field
              class="width20per"
              :rules="firstnameRules"
              v-model="form.schoolDetailsInfo.headmaster.firstname"
              label="Imię"
              required
            ></v-text-field>
            <v-text-field
              class="width20per"
              v-model="form.schoolDetailsInfo.headmaster.lastname"
              :rules="lastnameRules"
              label="Nazwisko"
              required
            ></v-text-field>
            <v-text-field
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
          <div style="width: 100%; display: flex">
            <v-select
              class="width20per"
              v-model="coordinator.title"
              :items="titles"
              :rules="titleRules"
              item-value="id"
              item-title="name"
              label="Tytuł"
              required
              readonly
            ></v-select>
            <v-text-field
              class="width20per"
              :rules="firstnameRules"
              v-model="coordinator.firstname"
              label="Imię"
              required
              readonly
            ></v-text-field>
            <v-text-field
              class="width20per"
              v-model="coordinator.lastname"
              :rules="lastnameRules"
              label="Nazwisko"
              required
              readonly
            ></v-text-field>
          </div>
          <div style="width: 100%; display: flex">
            <v-text-field
              v-model="coordinator.email"
              :rules="emailRules"
              label="E-mail"
              type="email"
              placeholder="adres@strona.pl"
              required
              readonly
            ></v-text-field>
            <v-text-field
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
            style="--v-input-control-height: 0px; height: 30px; margin-top: -1%"
            v-model="coordinator.wantsToRate"
          ></v-checkbox>
        </div>
          <div style="width: 100%; display: flex; justify-content: space-between;">
            <legend style="width: 50%">Dane dotyczace Nauczyciela:</legend>
            <legend style="width: 20%">Dane dotyczace klasy:</legend>
            <v-btn @click="addSchoolClass" style="width: 11%; border: 1px solid #00BFFF; ">Dodaj klasę</v-btn>
            <v-btn @click="deleteSchoolClass()" style="width: 18%; border: 1px solid #00BFFF;">Usuń ostatnią klasę</v-btn>
          </div>
          <v-list>
            <v-list-item v-for="(schoolClass) in form.schoolClasses">
              <div style="width: 100%; display: flex">
                <v-select
                  @update:modelValue="validate"
                  class="width20per"
                  v-model="schoolClass.title"
                  :items="titles"
                  :rules="titleRules"
                  item-value="id"
                  item-title="name"
                  label="Tytuł"
                  required
                ></v-select>
                <v-text-field
                  :rules="firstnameRules"
                  v-model="schoolClass.firstname"
                  label="Imię"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="schoolClass.lastname"
                  :rules="lastnameRules"
                  label="Nazwisko"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="schoolClass.name"
                  :rules="schoolClassNameRules"
                  label="Nazwa klasy"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="schoolClass.students"
                  :rules="schoolClassstudentsRules"
                  label="Ilość uczniów"
                  required
                  type="number"
                  min="0"
                  max="100"
                ></v-text-field>
                <v-select
                  @update:modelValue="validate"
                  v-model="schoolClass.language"
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
          <small class="visible-on-print" :class="{ 'visible-on-print': shouldShowSignature }"><hr> Data i podpis Dyrektora szkoły </small>
        <div style="width: 33.3%; display: flex">
          <v-btn color="error" block @click="reset"> Wyczyść formularz </v-btn>
          <v-btn color="blue" block onclick="print()">Zobacz podgląd</v-btn>
          <v-btn color="success" block type="submit" :disabled="!valid">Zapisz i pobierz
            <span class="additional-text">(plik do wydruku zapisał się do pobranych)</span></v-btn>
        </div>
      </v-Form>
    </div>
  </v-sheet>
</template>

<style>
.additional-text {
  font-size: smaller; /* Możesz dostosować rozmiar czcionki według własnych preferencji */
  display: block;
  margin-top: 5px; /* Dodałem margines na górę dla lepszego odstępu */
}
.err {
  float: right;
}
hr {
  border: none;
  border-top: 1px dotted rgb(0, 0, 0);
  color: #fff;
  background-color: #fff;
  height: 1px;
  margin-top: 40px;
}
.v-field__input {
  padding-right: 10px;
}
.visible-on-print {
  display: none;
}
@media print {
  #buttonDisplayNone,
  .v-field__append-inner,
  .v-input__details,
  .passoword {
    display: none;
  }
  .v-btn {
    visibility: hidden;
  }
  #labelPrintSize {
    font-size: 10px;
  }
  .Signature {
    visibility: visible;
  }
  .visible-on-print {
    display: block !important;
    margin-left: 75% !important;
  }
  .pageA4 {
    margin-top: -2.9% !important;
  }
  .width20per {
    max-width: 20% !important;
  }
}
</style>
