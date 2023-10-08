<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { object, string, ref } from 'yup'
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      schema: object({
        schoolEmail: string().email("To musi być e-mail").required("Pole jest wymagane"),
        headmasterEmail: string().email("To musi być e-mail").required("Pole jest wymagane"),
        coordinatorEmail: string().email("To musi być e-mail").required("Pole jest wymagane"),
        password: string().min(5,"Hasło musi mieć minimum 5 znaków").required("Pole jest wymagane"),
        passwordConfirmation: string().required("Pole jest wymagane").oneOf([ref('password')], 'Hasło nie pasuje'),
      }),
      firstnameRules: [
        v => !!v || 'Imię jest wymagane',
      ],
      lastnameRules: [
        v => !!v || 'Miasto jest wymagane',
      ],
      cityRules: [
        v => !!v || 'Miasto jest wymagane',
      ],
      nameRules: [
        v => !!v || 'Nazwa szkoły jest wymagana',
      ],
      patronRules: [
        v => !!v || 'Patron jest wymagany',
      ],
      phoneRules: [
        v => !!v || 'Numer telefonu jest wymagany',
      ],
      emailRules: [
        v => !!v || 'E-mail jest wymagany',
      ],
      streetRules: [
        v => !!v || 'Ulica jest wymagana',
      ],
      buildingAndPremisesRules: [
        v => !!v || 'Nr budynku i lokalu jest wymagany',
      ],
      preciseCityRules: [
        v => !!v || 'Miasto jest wymagane',
      ],
      postRules: [
        v => !!v || 'Kod pocztowy jest wymagany',
      ],
      complexRules: [
        v => !!v || 'Zespół szkół jest wymagany',
      ],
      passwordRules: [
        v => !!v || 'Hasło jest wymagane',
        v => (v && v.length >= 5) || 'Hasło musi mieć minimum 5 znaków',
      ],
      confirmPasswordRules: [
        v => !!v || 'Potwierdzenie hasła jest wymagane',
        v => (v && v == this.form.coordinator.password ) || 'Hasła nie są zgodne',
      ],
      schoolClassNameRules: [
        v => !!v || 'Nazwa klasy jest wymagana',
      ],
      schoolClassstudentsRules: [
        v => !!v || 'Ilość uczniów jest wymagana',
      ],
      titleRules: [
        v => !!v || 'Tytuł jest wymagany',
      ],
      shouldShowSignature: false,
      voivodeships: [],
      counties: [],
      communities: [],
      categories: [],
      titles: [],
      languages: [],
      regions: [],
      form: {
        schoolData: {
          voivodeship: null,
          county: null,
          community: null,
          region: null,
          category: null,
          city: "",
          complex: "",
          name: "",
          patron: "",
          phone: "",
          email: "",
          street: "",
          buildingAndPremises: "",
          preciseCity: "",
          post: "",
          headmaster: {
            title: null,
            firstname: "",
            lastname: "",
            email: "",
          }
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
        schoolClass: {
          title: null,
          firstname: "",
          lastname: "",
          name: "",
          students: null,
          language: null,
        }
      }
    }
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
      this.voivodeships = response.data
    })
    this.axios.get(`http://localhost:8080/categories`).then((response) => {
      this.categories = response.data
    })
    this.axios.get(`http://localhost:8080/titles`).then((response) => {
      this.titles = response.data
    })
    this.axios.get(`http://localhost:8080/languages`).then((response) => {
      this.languages = response.data
    })
    this.axios.get(`http://localhost:8080/regions`).then((response) => {
      this.regions = response.data
    })
  },
  watch: {
    "form.schoolData.voivodeship"(value) {
      this.axios.get(`http://localhost:8080/counties/?voivodeship=${value}`).then((response) => {
        this.counties = response.data
      })
    },
    "form.schoolData.county"(value) {
      this.axios.get(`http://localhost:8080/communities/?county=${value}`).then((response) => {
        this.communities = response.data
      })
    }
  },

  methods: {
    print(){
      this.shouldShowSignature = true
      window.print
      this.shouldShowSignature = false
    },
    onSubmit(values) {
      if (window.confirm("Czy potwierdzasz zgodność danych?")) {
        this.axios.post('http://localhost:8080/form', this.form).then(response => {
          alert("Formularz został zgłoszony.")
        }).catch(err => {
          alert('Wystąpił nieoczekiwany błąd.')
        })
      }
    },
    validatePassword(value) {
      if (!value) {
        return 'Hasło jest wymagane';
      }
      if (this.form.coordinator.confirmPassword != value) {
        return 'Hasła nie są zgodne';
      }
      return true;
    },
    async validate () {
        const { valid } = await this.$refs.form.validate()

        if (valid) alert('Formularz został poprawnie wypełniony')
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
  }
}
</script>

<template id="tutaj">
<v-sheet class="mx-auto">
  <div class="pageA4">
    <v-Form ref="form" @submit="onSubmit" :validationSchema="schema">
      <h2>Formularz Zgłoszeniowy</h2>
      <div >
        <legend>Dane Szkoły:</legend>
        <div style="width:auto;  display: flex;">
          <v-select
              v-model="form.schoolData.voivodeship"
              :items="voivodeships"
              item-value="id"
              item-title="name"
              label="Wybierz województwo"
              :rules="[v => !!v || 'Województwo jest wymagane']"
              required
            ></v-select>
            <v-select
              v-model="form.schoolData.county"
              :items="counties"
              item-value="id"
              item-title="name"
              label="Wybierz powiat"
              :disabled="(counties.length < 1)"
              :rules="[v => !!v || 'Powiat jest wymagany']"
              required
            ></v-select>
            <v-select
              v-model="form.schoolData.community"
              :disabled="(communities.length < 1)"
              :items="communities"
              item-value="id"
              item-title="name"
              label="Wybierz gminę"
              :rules="[v => !!v || 'Gmina jest wymagana']"
              required
            ></v-select>
            <v-select
              v-model="form.schoolData.region"
              :items="regions"
              item-value="id"
              item-title="name"
              label="Wybierz region"
              :rules="[v => !!v || 'Region jest wymagany']"
              required
            ></v-select>
        </div>
        <div style="width:100%; display: flex;">
          <v-select
              v-model="form.schoolData.category"
              :items="categories"
              item-value="id"
              item-title="name"
              label="Wybierz kategorię"
              :rules="[v => !!v || 'Kategoria jest wymagana']"
              required
            ></v-select>
          <v-text-field
            v-model="form.schoolData.city"
            :rules="cityRules"
            label="Miejscowość"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.schoolData.complex"
            :rules="complexRules"
            label="Zespołu szkół"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.schoolData.name"
            :rules="nameRules"
            label="Nazwa szkoły"
            required
          ></v-text-field> 
      </div>
      <div style="width:100%; display: flex;">
        <v-text-field
            v-model="form.schoolData.patron"
            
            :rules="patronRules"
            label="Patron"
            required
          ></v-text-field>  
          <v-text-field
            v-model="form.schoolData.phone"
            :counter="12"
            :rules="phoneRules"
            label="Numer telefonu"
            placeholder="+48 000 000 000"
            required
          ></v-text-field>  
          <v-text-field
            v-model="form.schoolData.email"
            
            :rules="emailRules"
            label="E-mail"
            placeholder="adres@poczta.pl"
            required
          ></v-text-field>  
      </div>
      <legend>Dokładny adres szkoły (tak jak na kopercie, bez nazwy szkoły):</legend>
      <div style="width:100%; display: flex;">
        <v-text-field
            v-model="form.schoolData.street"
            
            :rules="streetRules"
            label="Ulica"
            required
          ></v-text-field> 
          <v-text-field
            v-model="form.schoolData.buildingAndPremises"
            
            :rules="buildingAndPremisesRules"
            label="Nr budynku i lokalu"
            required
          ></v-text-field>   
          <v-text-field
            v-model="form.schoolData.preciseCity"
            
            :rules="preciseCityRules"
            label="Miejscowość"
            required
          ></v-text-field>  
          <v-text-field
            v-model="form.schoolData.post"
            :counter="6"
            :rules="postRules"
            label="Kod pocztowy"
            required
            placeholder="00-000"
          ></v-text-field>  
      </div>
      </div>

      <div >
        <legend>Dane Dyrektora Szkoły:</legend>
        <div style="width:100%; display: flex;">
          <v-select class="width20per"
              v-model="form.schoolData.headmaster.title"
              :rules="titleRules"
              :items="titles"
              item-value="id"
              item-title="name"
              label="Wybierz tytuł"
              required
            ></v-select>
            <v-text-field class="width20per"
            v-model="form.schoolData.headmaster.firstname"
            :rules="firstnameRules"
            label="Imię"
            required
          ></v-text-field>  
          <v-text-field class="width20per"
            v-model="form.schoolData.headmaster.lastname"
            
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
      <div >
        <legend>Dane dotyczace Nauczyciela koordynujacego przebieg konkursu w szkole:</legend>
        <div style="width:100%; display: flex;">

        <v-select class="width20per"
              v-model="form.coordinator.title"
              :items="titles"
              :rules="titleRules"
              item-value="id"
              item-title="name"
              label="Wybierz tytuł"
              required
            ></v-select>
            <v-text-field class="width20per"
            v-model="form.coordinator.firstname"
            :rules="firstnameRules"
            label="Imię"
            required
          ></v-text-field>  
          <v-text-field class="width20per"
            v-model="form.coordinator.lastname"
            :rules="lastnameRules"
            label="Nazwisko"
            required
          ></v-text-field>  
          <v-text-field
            v-model="form.coordinator.email"
            
            :rules="emailRules"
            label="E-mail"
            placeholder="adres@strona.pl"
            required
          ></v-text-field>
        </div> 
        <div style="width:100%; display: flex;">
        <v-text-field
            v-model="form.coordinator.password"
            :rules="passwordRules"
            label="Hasło"
            type="password"
            Field :validateOnInput="true"
            @click:append="show1 = !show1"
            required
          ></v-text-field> 
          <v-text-field
            v-model="form.coordinator.confirmPassword"
            :rules="confirmPasswordRules"
            label="Potwierdź hasło"
            type="password" 
            name="passwordConfirmation"
            Field  :validateOnInput="true"
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
        <label id="labelPrintSize"  for="wantsToRate">Prosimy o zaznaczenie poniższego pola w przypadku chęci udziału koordynatora w
            pracach
            Komisji Sprawdzającej prace uczestników konkursu z etapu finałowego w swoim regionie.
            Na podstawie powyższej deklaracji Przewodniczący RKO MK „MBG” będzie mógł w razie potrzeby zaprosić
            koordynatora do udziału w sprawdzaniu prac konkursowych.
            O faktycznym udziale w pracach Komisji koordynator zdecyduje przyjmując bądź odrzucając otrzymane
            zaproszenie.
            Jednocześnie informujemy, że wszystkie osoby zaangażowane w organizację i przebieg konkursu działają na
            zasadzie wolontariatu. Deklaracja współpracy jest całkowicie dobrowolna.
          </label>
          <v-checkbox style="--v-input-control-height:0px; height: 30px;margin-top: -1% ;"
            v-model="form.coordinator.wantsToRate"
          ></v-checkbox>
        </div>
          <!-- <label for="titles">Wybierz tytuł:</label>
          <select id="titles-coordinator" v-model="form.coordinator.title">
            <option value="0">Wybierz tytuł</option>
            <option v-for="title in titles" :value="title.id"> {{ title.name }}</option>
          </select> -->
  
          <!-- <label for="imn">Imię:</label>
          <input v-model="form.coordinator.firstname" type="text" name="imn" placeholder="Imię"> -->
  
          <!-- <label for="nazn">Nazwisko:</label>
          <input v-model="form.coordinator.lastname" type="text" name="nazn" placeholder="Nazwisko"> -->

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
        
      <div > 
        <legend>Dane dotyczace Nauczyciela:</legend>
        <div style="width:100%; display: flex;">
        <v-select class="width20per"
              v-model="form.schoolClass.title"
              :items="titles"
              :rules="titleRules"
              item-value="id"
              item-title="name"
              label="Wybierz tytuł"
              required
            ></v-select>
            <v-text-field 
            v-model="form.schoolClass.firstname"
            :rules="firstnameRules"
            label="Imię"
            required
          ></v-text-field>  
          <v-text-field 
            v-model="form.schoolClass.lastname"
            
            :rules="lastnameRules"
            label="Nazwisko"
            required
          ></v-text-field>  
        </div>
          <legend>Dane dotyczace klasy:</legend>
          <div style="width:100%; display: flex;">
          <v-text-field
            v-model="form.schoolClass.name"
            :rules="schoolClassNameRules"
            label="Nazwa klasy"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.schoolClass.students"
            
            :rules="schoolClassstudentsRules"
            label="Ilość uczniów"
            required
            type="number"
            min="0"
            max="40"
          ></v-text-field>  
          <v-select
              v-model="form.schoolClass.language"
              :items="languages"
              :rules="[v => !!v || 'Język jest wymagany']"
              item-value="id"
              item-title="name"
              label="Wybierz język"
              required
            ></v-select>
            </div>
            
            <small class="visible-on-print" :class="{ 'visible-on-print': shouldShowSignature }">
              <hr>
              Data i podpis Dyrektora szkoły
            </small>
            
          </div>
      <div class="d-flex flex-column">
        <v-btn
          color="success"
          class="mt-4"
          block
          @click="validate"
          >
          Sprawdzenie
        </v-btn>
        <v-btn
          color="error"
          class="mt-4"
          block
          @click="reset"
        >
          Wyczyść formularz
        </v-btn>
        <v-btn
          color="warning"
          class="mt-4"
          block
          @click="resetValidation"
        >
          Zrestartuj sprawdzenie
        </v-btn>
        <div class="buttons">
        <v-btn onclick=print() color="grey">drukuj i wyślij</v-btn>
      </div>
      </div>
    </v-Form>
  </div>
  </v-sheet>
</template>

<style>
.pageA4 {
  color: rgb(0, 0, 0);
  background-color: #ffffff;
  margin: 1% !important;
}
form h2{
  text-align: center;
}


.buttons {
  display: flex;
  margin: auto;
  margin: 1rem;
  justify-content: center; 
}

.err{
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
.v-field__input{
    padding-right: 10px;
}
.v-select{
  max-width: 25%;
}
.visible-on-print {
  display: none;
}
@media print {
  #buttonDisplayNone, .v-field__append-inner, .v-input__details, .v-field-label--floating, .v-btn{
  display: none;
  }
  #labelPrintSize{
    font-size: 12px;
  }
  .Signature{
    visibility: visible;
  }
  .visible-on-print {
    display: block !important;
    margin-left: 75% !important;
  }
  .pageA4{
    margin-top: -3% !important;
  }
  .width20per{
    max-width: 20% !important;
  }
}
</style>