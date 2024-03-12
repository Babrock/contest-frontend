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
        id:"",
        schoolInfo: {
            // voivodeship: null,
            // county: null,
            // community: null,
            city:{
                id: null,
                name:"",
            },
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
          region: "",
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
        user:{
            title: null,
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
            wantsToRate: null,
        }
      },
      updatedForm:{
            schoolInfo: {
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
    // this.axios.get(`http://localhost:8080/school-types`).then((response) => {
    //   this.schoolTypes = response.data;
    // });
  },
  watch: {
    '$refs.form.formData': {
      handler: 'validate',
      deep: true,
    },
    // "form.schoolDetailsInfo.region"(value) {
    //   if (value === null) return;
    //   this.axios
    //     .get(`http://localhost:8080/voivodeships/region/${value}`)
    //     .then((response) => {
    //       this.voivodeships = response.data;
    //     });
    // },
    "form.schoolInfo.voivodeship"(value) {
      if (value === null) return;
      this.axios
        .get(`http://localhost:8080/counties?voivodeship=${value}`)
        .then((response) => {
          this.counties = response.data;
        });
    },
    "form.schoolInfo.county"(value) {
      if (value === null) return;
      this.axios
        .get(`http://localhost:8080/communities?county=${value}`)
        .then((response) => {
          this.communities = response.data;
        });
    },
    "form.schoolInfo.community"(value) {
      if (value === null) return;
      this.axios
        .get(`http://localhost:8080/cities?community=${value}`)
        .then((response) => {
          this.cities = response.data;
        });
    },
    "form.schoolInfo.city.id"(value) {
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
    // getSchoolDetails(id) {
    //   this.axios.get(`http://localhost:8080/schools/${id}`).then((response) => {
    //     let data = response.data
    //     this.form.schoolData.phone = data.phone
    //     this.form.schoolData.email = data.email
    //     this.form.schoolData.street = data.street
    //     this.form.schoolData.address = data.address
    //     this.form.schoolData.apartmentNumber = data.apartmentNumber
    //     this.form.schoolData.zipCode = data.zipCode
    //     this.form.schoolData.post = data.post
    //     var fullName = data.headmasterFullName
    //     var nameParts = fullName.split(" ")
    //     this.form.schoolDetailsInfo.headmaster.firstname = nameParts[0]
    //     this.form.schoolDetailsInfo.headmaster.lastname = nameParts.slice(1).join(" ")
    //   });
    // },
    // getUserDetails(){
    //   this.axios.get(`http://localhost:8080/users/details`).then((response) => {
    //     let data = response.data
    //     this.coordinator.title = data.title
    //     this.coordinator.firstname = data.firstname
    //     this.coordinator.lastname = data.lastname
    //     this.coordinator.phone = data.phone
    //     this.coordinator.email = data.email
    //   });
    // },
    updateValues(id) {
    //   this.getSchoolDetails(id);
    //   this.getUserDetails();
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
    getForm() {
      let match = this.form.id.match(/\b\d+\b/);
      let formNumber = this.form.id
      this.form.id = match[0];
      
      console.log("id formularza", formNumber)

      // if (this.form.id == null) {
      //   window.alert("Nie wprowadziłeś numeru formularzu");
      //   return;
      // }
      this.axios.all([
        this.axios.get(`http://localhost:8080/form/combinedInfo/${formNumber}`),
        this.axios.get(`http://localhost:8080/classes?form_id=${this.form.id}`)
        ]).then((responses) => {
          const [formResponse, classesResponse] = responses
          let dataFormResposne = formResponse.data
          this.form.schoolClasses = classesResponse.data

          this.form.schoolDetailsInfo.region = dataFormResposne.schoolDetails.region.id

          this.form.schoolInfo.voivodeship = dataFormResposne.school.city.community.county.voivodeship.id
          this.form.schoolInfo.county = dataFormResposne.school.city.community.county.id
          this.form.schoolInfo.community = dataFormResposne.school.city.community.id
          this.form.schoolInfo.city.id = dataFormResposne.school.city.id
          this.form.schoolInfo.city.name = dataFormResposne.school.city.name
          this.form.schoolInfo.school = dataFormResposne.school.id

          this.form.schoolInfo.street = dataFormResposne.school.street
          this.form.schoolInfo.address = dataFormResposne.school.address
          this.form.schoolInfo.apartmentNumber = dataFormResposne.school.apartmentNumber
          this.form.schoolInfo.zipCode = dataFormResposne.school.zipCode
          this.form.schoolInfo.post = dataFormResposne.school.post
          this.form.schoolInfo.phone = dataFormResposne.school.phone
          this.form.schoolInfo.email = dataFormResposne.school.email

          this.form.schoolDetailsInfo.category = dataFormResposne.schoolDetails.category.id
          this.form.schoolDetailsInfo.schoolComplex = dataFormResposne.schoolDetails.schoolComplex
          this.form.schoolDetailsInfo.schoolType = dataFormResposne.schoolDetails.schoolType.id

          this.form.schoolDetailsInfo.headmaster.title = dataFormResposne.schoolDetails.title.id
          this.form.schoolDetailsInfo.headmaster.firstname = dataFormResposne.schoolDetails.firstname
          this.form.schoolDetailsInfo.headmaster.lastname = dataFormResposne.schoolDetails.lastname
          this.form.schoolDetailsInfo.headmaster.email = dataFormResposne.schoolDetails.email

          this.form.user.title = dataFormResposne.user.title
          this.form.user.firstname = dataFormResposne.user.firstname
          this.form.user.lastname = dataFormResposne.user.lastname
          this.form.user.email = dataFormResposne.user.email
          this.form.user.phone = dataFormResposne.user.phone
          this.form.user.wantsToRate = dataFormResposne.user.wantsToRate

        })
        .catch((error) => {
          window.alert("Nie ma takiego formularza!");
        });
    },
    accepted(){
      this.axios.put(`http://localhost:8080/form/${this.form.id}`)
      .then((response) => {
        alert("Formularz został zedytowany.");
      })
      .catch((err) => {
        alert("Wystąpił nieoczekiwany błąd.");
      });
    },
  },
};
</script>

<template>
  {{ form }}
  <v-sheet class="mx-auto">
    <div class="pageA4">
      <v-Form ref="form" @input="validate" @submit.prevent="onSubmit">
        <h2 v-if="formResponse" style="text-align: center; margin-top: 0.5%; background-color: rgb(var(--v-theme-on-surface-variant));">
          Edytuj Formularz Zgłoszeniowy {{ formResponse.combinedInfo }}
        </h2>
        <v-text-field
        v-model="form.id"
        label="Kod formularza"
        type="text"
        required
        ></v-text-field>
        <div style="width: 50%; display: flex; justify-content: space-between">
        <v-btn color="grey" @click="getForm" >Pobierz formularz</v-btn>
        <v-btn color="success" @click="accepted">Akceptuj edycję formularza</v-btn>
        </div>
        <div>            
          <v-select
              v-model="form.schoolDetailsInfo.region"
              @update:modelValue="form.schoolInfo.voivodeship = null"
              :items="regions"
              item-value="id"
              item-title="name"
              label="Region"
              :rules="[(v) => !!v || 'Region jest wymagany']"
              required
            ></v-select>
          <legend>Dane Szkoły:</legend>
          <!-- {{form}} -->
          <div style="width: auto; display: flex">
            <v-select
              v-model="form.schoolInfo.voivodeship"
              @update:modelValue="form.schoolInfo.county = null"
              :disabled="voivodeships.length < 1"
              :items="voivodeships"
              item-value="id"
              item-title="name"
              label="Województwo"
              :rules="[(v) => !!v || 'Województwo jest wymagane']"
              required
            ></v-select>
            <v-select
              v-model="form.schoolInfo.county"
              @update:modelValue="form.schoolInfo.community = null"
              :items="counties"
              item-value="id"
              item-title="name"
              label="Powiat"
              :rules="[(v) => !!v || 'Powiat jest wymagany']"
              required
            ></v-select>
            <v-autocomplete
              v-model="form.schoolInfo.community"
              @update:modelValue="form.schoolInfo.city.id = null"
              :items="communities"
              item-value="id"
              item-title="name"
              label="Gmina"
              :rules="[(v) => !!v || 'Gmina jest wymagana']"
              required
            ></v-autocomplete>
            <v-autocomplete
              v-model="form.schoolInfo.city"
              @update:modelValue="form.schoolInfo.school = null"
              :items="cities"
              item-value="id"
              item-title="name"
              label="Miasto"
              :rules="cityRules"
              required
            ></v-autocomplete>
          </div>
          <v-autocomplete
            v-model="form.schoolInfo.school"
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
              :disabled="schoolTypes.length < 1"
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
              v-model="form.schoolInfo.phone"
              readonly
              :counter="12"
              :rules="phoneRules"
              label="Numer telefonu"
              placeholder="+48 000 000 000"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.schoolInfo.email"
              :rules="emailRules"
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
              v-model="form.schoolInfo.street"
              label="Ulica"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.schoolInfo.address"
              :rules="addressRules"
              label="Nr budynku"
              required
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.schoolInfo.apartmentNumber"
              label="Nr lokalu"
              required
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.schoolInfo.zipCode"
              :rules="zipCodeRules"
              label="Kod pocztowy"
              required
              placeholder="00-000"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.schoolInfo.post"
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
              v-model="form.user.title"
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
              v-model="form.user.firstname"
              label="Imię"
              required
              readonly
            ></v-text-field>
            <v-text-field
              class="width20per"
              v-model="form.user.lastname"
              :rules="lastnameRules"
              label="Nazwisko"
              required
              readonly
            ></v-text-field>
          </div>
          <div style="width: 100%; display: flex">
            <v-text-field
              v-model="form.user.email"
              :rules="emailRules"
              label="E-mail"
              type="email"
              placeholder="adres@strona.pl"
              required
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.user.phone"
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
            v-model="form.user.wantsToRate"
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
          
      </v-Form>
    </div>
  </v-sheet>
</template>

<style>
.sub-text {
  position: absolute;
  top: 80%;
  font-size: 60%; /* Adjust the font size as needed */
  color: rgb(0, 0, 0); /* Adjust the color as needed */
}
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
</style>
