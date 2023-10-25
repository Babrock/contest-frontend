<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { object, string, ref } from "yup";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      schema: object({
        schoolEmail: string()
          .email("To musi być e-mail")
          .required("Pole jest wymagane"),
        headmasterEmail: string()
          .email("To musi być e-mail")
          .required("Pole jest wymagane"),
        coordinatorEmail: string()
          .email("To musi być e-mail")
          .required("Pole jest wymagane"),
        password: string()
          .min(5, "Hasło musi mieć minimum 5 znaków")
          .required("Pole jest wymagane"),
        passwordConfirmation: string()
          .required("Pole jest wymagane")
          .oneOf([ref("password")], "Hasło nie pasuje"),
      }),
      firstnameRules: [(v) => !!v || "Imię jest wymagane"],
      lastnameRules: [(v) => !!v || "Nazwisko jest wymagane"],
      cityRules: [(v) => !!v || "Miasto jest wymagane"],
      nameRules: [(v) => !!v || "Nazwa szkoły jest wymagana"],
      schoolTypesRules: [(v) => !!v || "Typ szkoły jest wymagany"],
      phoneRules: [(v) => !!v || "Numer telefonu jest wymagany"],
      emailRules: [(v) => !!v || "E-mail jest wymagany"],
      streetRules: [(v) => !!v || "Ulica jest wymagana"],
      addressRules: [(v) => !!v || "Nr budynku"],
      postRules: [(v) => !!v || "Miejscowość jest wymagana"],
      zipCodeRules: [(v) => !!v || "Kod pocztowy jest wymagany"],
      complexRules: [(v) => !!v || "Zespół szkół jest wymagany"],
      passwordRules: [
        (v) => !!v || "Hasło jest wymagane",
        (v) => (v && v.length >= 5) || "Hasło musi mieć minimum 5 znaków",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Potwierdzenie hasła jest wymagane",
        (v) =>
          (v && v == this.form.coordinator.password) || "Hasła nie są zgodne",
      ],
      schoolClassNameRules: [(v) => !!v || "Nazwa klasy jest wymagana"],
      schoolClassstudentsRules: [(v) => !!v || "Ilość uczniów jest wymagana"],
      titleRules: [(v) => !!v || "Tytuł jest wymagany"],
      shouldShowSignature: false,
      voivodeships: [],
      counties: [],
      communities: [],
      cities: [],
      schools: [],
      schoolTypes: [],
      headmastersNameAndLastname: [],
      schoolsDictionary: [],
      categories: [],
      titles: [],
      languages: [],
      form: {
        schoolData: {
          voivodeship: null,
          county: null,
          community: null,
          city: null,
          school: null,
          street: "",
          address: "",
          apartmentNumber: "",
          zipCode: "",
          post: "",
          phone: "",
          email: "",
          category: null,
          complex: "",
          schoolType: "",
          headmaster: {
            title: null,
            firstnameHeadmaster: null,
            lastnameHeadmaster: null,
            email: "",
          },
        },
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
    this.axios.get(`http://localhost:8080/school-types`).then((response) => {
      this.schoolTypes = response.data;
    });
  },
  watch: {
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
  },

  methods: {
    print() {
      this.shouldShowSignature = true;
      window.print;
      this.shouldShowSignature = false;
    },
    onSubmit(values) {
      if (window.confirm("Czy potwierdzasz zgodność danych?")) {
        this.axios
          .post("http://localhost:8080/form", this.form)
          .then((response) => {
            alert("Formularz został zgłoszony.");
          })
          .catch((err) => {
            alert("Wystąpił nieoczekiwany błąd.");
          });
      }
    },
    validatePassword(value) {
      if (!value) {
        return "Hasło jest wymagane";
      }
      if (this.form.coordinator.confirmPassword != value) {
        return "Hasła nie są zgodne";
      }
      return true;
    },
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) alert("Formularz został poprawnie wypełniony");
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    getSchoolDetails(id) {
      this.axios.get(`http://localhost:8080/schools/${id}`).then((response) => {
        let data = response.data;
        this.form.schoolData.street = data.street;
        this.form.schoolData.address = data.address;
        this.form.schoolData.apartmentNumber = data.apartmentNumber;
        this.form.schoolData.zipCode = data.zipCode;
        this.form.schoolData.post = data.post;
        this.form.schoolData.phone = data.phone;
        this.form.schoolData.email = data.email;
        this.form.schoolData.headmaster.firstnameHeadmaster =
          data.firstnameHeadmaster;
        this.form.schoolData.headmaster.lastnameHeadmaster =
          data.lastnameHeadmaster;
      });
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
      <v-Form ref="form" @submit="onSubmit" :validationSchema="schema">
        <h2
          style="
            text-align: center;
            background-color: rgb(var(--v-theme-on-surface-variant));
          "
        >
          Formularz Zgłoszeniowy
        </h2>
        {{ form }}
        <div>
          <legend>Dane Szkoły:</legend>
          <div style="width: auto; display: flex">
            <v-select
              v-model="form.schoolData.voivodeship"
              @update:modelValue="form.schoolData.county = null"
              :items="voivodeships"
              item-value="id"
              item-title="name"
              label="Województwo"
              :rules="[(v) => !!v || 'Województwo jest wymagane']"
              required
            ></v-select>
            <v-select
              v-model="form.schoolData.county"
              @update:modelValue="form.schoolData.community = null"
              :items="counties"
              item-value="id"
              item-title="name"
              label="Powiat"
              :disabled="counties.length < 1"
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
            :items="schools"
            item-value="id"
            item-title="name"
            @update:modelValue="getSchoolDetails"
            :rules="nameRules"
            label="Nazwa szkoły"
            required
          ></v-autocomplete>
          <div style="width: 100%; display: flex">
            <v-select
              v-model="form.schoolData.category"
              :items="categories"
              item-value="id"
              item-title="name"
              label="Kategoria"
              :rules="[(v) => !!v || 'Kategoria jest wymagana']"
              required
            ></v-select>
            <v-text-field
              v-model="form.schoolData.complex"
              :rules="complexRules"
              label="Zespołu szkół"
              required
            ></v-text-field>
            <v-select
              v-model="form.schoolData.schoolType"
              :items="schoolTypes"
              item-value="id"
              item-title="name"
              :rules="schoolTypesRules"
              label="Typ szkoły"
              required
            ></v-select>
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
              :rules="streetRules"
              readonly
              label="Ulica"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.schoolData.address"
              :rules="addressRules"
              readonly
              label="Nr budynku"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.schoolData.apartmentNumber"
              readonly
              label="Nr lokalu"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.schoolData.post"
              :rules="postRules"
              readonly
              label="Miejscowość"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.schoolData.zipCode"
              :rules="zipCodeRules"
              readonly
              label="Kod pocztowy"
              required
              placeholder="00-000"
            ></v-text-field>
          </div>
        </div>

        <div>
          <legend>Dane Dyrektora Szkoły:</legend>
          <div style="width: 100%; display: flex">
            <v-select
              class="width20per"
              v-model="form.schoolData.headmaster.title"
              :rules="titleRules"
              :items="titles"
              item-value="id"
              item-title="name"
              label="Tytuł"
              required
            ></v-select>
            <v-text-field
              class="width20per"
              v-model="form.schoolData.headmaster.firstnameHeadmaster"
              :rules="firstnameRules"
              label="Imię"
              required
            ></v-text-field>
            <v-text-field
              class="width20per"
              v-model="form.schoolData.headmaster.lastnameHeadmaster"
              :rules="lastnameRules"
              label="Nazwisko"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.schoolData.headmaster.email"
              :rules="emailRules"
              label="E-mail"
              placeholder="adres@strona.pl"
              required
            ></v-text-field>
          </div>
        </div>
        <div>
          <legend>
            Dane dotyczace Nauczyciela koordynujacego przebieg konkursu w
            szkole:
          </legend>
          <div style="width: 100%; display: flex">
            <v-select
              class="width20per"
              v-model="form.coordinator.title"
              :items="titles"
              :rules="titleRules"
              item-value="id"
              item-title="name"
              label="Tytuł"
              required
            ></v-select>
            <v-text-field
              class="width20per"
              v-model="form.coordinator.firstname"
              :rules="firstnameRules"
              label="Imię"
              required
            ></v-text-field>
            <v-text-field
              class="width20per"
              v-model="form.coordinator.lastname"
              :rules="lastnameRules"
              label="Nazwisko"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.coordinator.email"
              :rules="emailRules"
              label="E-mail"
              type="email"
              placeholder="adres@strona.pl"
              required
            ></v-text-field>
          </div>
          <div style="width: 100%; display: flex">
            <v-text-field
              v-model="form.coordinator.password"
              :rules="passwordRules"
              label="Hasło"
              type="password"
              Field
              :validateOnInput="true"
              @click:append="show1 = !show1"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.coordinator.confirmPassword"
              :rules="confirmPasswordRules"
              label="Potwierdź hasło"
              type="password"
              name="passwordConfirmation"
              Field
              :validateOnInput="true"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.coordinator.phone"
              :rules="phoneRules"
              label="Telefon"
              placeholder="+48 000 000 000"
              required
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
            v-model="form.coordinator.wantsToRate"
          ></v-checkbox>
        </div>





        <!-- <div class="w-50">
          <label for="coordinatorEmail">E-email:</label>
          <Field :validateOnInput="true" v-model="form.coordinator.email" type="email" name="coordinatorEmail" placeholder="Adres@strona.pl"/>
        </div>
        <ErrorMessage name="coordinatorEmail" /> -->

        <!-- <label for="password">Hasło:</label>
          <Field :validateOnInput="true" v-model="form.coordinator.password" type="password"
            name="password" placeholder="Haslo" /> -->
        <!-- <ErrorMessage name="password" /> -->

        <!-- <label for="passwordConfirmation">Potwierdź hasło:</label>
          <Field  :validateOnInput="true" v-model="form.coordinator.confirmPassword"
            type="password" name="passwordConfirmation" placeholder="Potwierdź hasło" /> -->
        <!-- <ErrorMessage name="passwordConfirmation" />   -->

        <!-- <label for="tel">Telefon:</label>
          <input v-model="form.coordinator.phone" type="number" name="tel" placeholder="+48 000 000 000"> -->

        <!-- <input type="checkbox" id="wantsToRate" v-model="form.coordinator.wantsToRate" /> -->


          <div style="width: 100%; display: flex">
            <legend style="width: 50%">Dane dotyczace Nauczyciela:</legend>
            <legend style="width: 20%">Dane dotyczace klasy:</legend>
            <v-btn @click="addSchoolClass" style="width: 12.5%">Dodaj klasę</v-btn>
            <v-btn @click="deleteSchoolClass()" style="width: 17.5%">Usuń ostatnią klasę</v-btn>
          </div>
          <v-list>
            <v-list-item v-for="(schoolClass) in form.schoolClasses">
              <div style="width: 100%; display: flex">
                <v-select
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
                  v-model="schoolClass.firstname"
                  :rules="firstnameRules"
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

        <div style="width: 25%; display: flex">
          <v-btn color="success" block @click="validate"> Sprawdzenie </v-btn>
          <v-btn color="error" block @click="reset"> Wyczyść formularz </v-btn>
          <v-btn color="warning" block @click="resetValidation">
            Zrestartuj sprawdzenie
          </v-btn>
          <v-btn color="grey" block type="submit" onclick="print()"
            >drukuj i wyślij</v-btn
          >
        </div>
      </v-Form>
    </div>
  </v-sheet>
</template>

<style>
.pageA4 {
  color: rgb(0, 0, 0);
  background-color: #ffffff;
  margin: 1%;
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
  .v-input__details {
    display: none;
  }
  .v-btn {
    visibility: hidden;
  }
  #labelPrintSize {
    font-size: 12px;
  }
  .Signature {
    visibility: visible;
  }
  .visible-on-print {
    display: block !important;
    margin-left: 75% !important;
  }
  .pageA4 {
    margin-top: -3% !important;
  }
  .width20per {
    max-width: 20% !important;
  }
}
</style>
