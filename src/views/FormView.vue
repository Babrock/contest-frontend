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
        schoolEmail: string().email("To musi być email").required("Pole jest wymagane"),
        headmasterEmail: string().email("To musi być email").required("Pole jest wymagane"),
        coordinatorEmail: string().email("To musi być email").required("Pole jest wymagane"),
        password: string().min(5,"Hasło musi mieć minimum 5 znaków").required("Pole jest wymagane"),
        passwordConfirmation: string().required("Pole jest wymagane").oneOf([ref('password')], 'Hasło nie pasuje'),
      }),
      voivodeships: [],
      counties: [],
      communities: [],
      categories: [],
      titles: [],
      languages: [],
      regions: [],
      form: {
        schoolData: {
          voivodeship: 0,
          county: 0,
          community: 0,
          region: 0,
          category: 0,
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
            title: 0,
            firstname: "",
            lastname: "",
            email: "",
          }
        },
        coordinator: {
          title: 0,
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
          title: 0,
          firstname: "",
          lastname: "",
          name: "",
          students: 0,
          language: 0,
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

  }
}
</script>

<template>
  <div class="pageA4">
    <Form @submit="onSubmit" :validationSchema="schema">
      <h1>Formularz Zgłoszeniowy</h1>
      <div class="container">
        <legend>Dane Szkoły:</legend>

        <div class="w-100">
          <div>
            <label for="voivodeships">Wybierz województwo:</label>
            <select id="voivodeships" v-model="form.schoolData.voivodeship">
              <option value="0">Wybierz województwo</option>
              <option v-for="voivodeship in voivodeships" :value="voivodeship.id"> {{ voivodeship.name }} </option>
            </select>
          </div>

          <div class="w-100">
            <label for="counties">Wybierz powiat:</label>
            <select id="counties" v-model="form.schoolData.county" :disabled="(counties.length < 1)">
              <option v-for="county in counties" :value="county.id"> {{ county.name }} </option>
            </select>
          </div>

          <div class="w-100">
            <label for="communities">Wybierz gmine:</label>
            <select id="communities" v-model="form.schoolData.community" :disabled="(communities.length < 1)">
              <option v-for="community in communities" :value="community.id"> {{ community.name }}</option>
            </select>
          </div>

          <div class="w-100">
            <label for="regions">Wybierz Region szkoły:</label>
            <select id="regions" v-model="form.schoolData.region">
              <option value="0">Wybierz Region szkoły</option>
              <option v-for="region in regions" :value="region.id"> {{ region.name }}</option>
            </select>
          </div>

          <div class="w-100">
            <label for="categories">Wybierz Typ szkoły:</label>
            <select id="categories" v-model="form.schoolData.category">
              <option value="0">Wybierz Typ szkoły</option>
              <option v-for="category in categories" :value="category.id"> {{ category.name }}</option>
            </select>
          </div>
        </div>

        <div class="w-100">
          <label for="ms">Miejscowość:</label>
          <input v-model="form.schoolData.city" type="text" name="ms" placeholder="Miejscowość">
        </div>
        <div class="w-100">
          <label for="zespolSzkol">Zespołu szkół:</label>
          <input v-model="form.schoolData.complex" type="text" name="zespolSzkol" placeholder="Zespół szkół">
        </div>
        <div class="w-100">
          <label for="nazszkoly">Nazwa szkoły:</label>
          <input v-model="form.schoolData.name" type="text" name="nazszkoly" placeholder="Nazwa szkoły">
        </div>
        <div class="w-100">
          <label for="patron">Patron:</label>
          <input v-model="form.schoolData.patron" type="text" name="patron" placeholder="Patron">
        </div>
        <div class="w-100">
          <label for="tel">Telefon:</label>
          <input v-model="form.schoolData.phone" type="tel" name="tel" placeholder="+48 000 000 000">
        </div>
        <div class="w-100">
          <label for="schoolEmail">E-email:</label>
          <Field :validateOnInput="true" v-model="form.schoolData.email" type="email" name="schoolEmail" placeholder="adres@strona.pl"/>
          <ErrorMessage class="err" name="schoolEmail" />
        </div>
        <div>
          <legend>Dokładny adres szkoły (tak jak na kopercie, bez nazwy szkoły)</legend>
        </div>
        <div class="w-100">
          <label for="ul">Ulica:</label>
          <input v-model="form.schoolData.street" type="text" name="ul" placeholder="ulica">
        </div>
        <div class="w-100">
          <label for="kp">Nr bud i lok:</label>
          <input v-model="form.schoolData.buildingAndPremises" type="text" name="kp" placeholder="Nr budynku i lokalu">
        </div>
        <div class="w-100">
          <label for="ms">Miejscowość:</label>
          <input v-model="form.schoolData.preciseCity" type="text" name="ms" placeholder="Miejscowość">
        </div>
        <div class="w-100">
          <label for="kp">Kod pocztowy:</label>
          <input v-model="form.schoolData.post" type="text" name="kp" placeholder="00-000">
        </div>
      </div>

      <div class="container">
        <legend>Dane Dyrektora Szkoły:</legend>
        <div class="w-100">
          <label for="titles">Wybierz tytuł:</label>
          <select id="titles-headmaster" v-model="form.schoolData.headmaster.title">
            <option value="0">Wybierz tytuł</option>
            <option v-for="title in titles" :value="title.id"> {{ title.name }}</option>
          </select>
        </div>
        <div class="w-100">
          <label for="im">Imie:</label>
          <input v-model="form.schoolData.headmaster.firstname" type="text" name="im" placeholder="Imie">
        </div>
        <div class="w-100">
          <label for="naz">Nazwisko:</label>
          <input v-model="form.schoolData.headmaster.lastname" type="text" name="naz" placeholder="Nazwisko">
        </div>
        <div class="w-100">
          <label for="headmasterEmail">E-email:</label>
          <Field :validateOnInput="true" v-model="form.schoolData.headmaster.email" type="email" name="headmasterEmail" placeholder="adres@strona.pl"/>
        </div>
          <ErrorMessage name="headmasterEmail" />
      </div>

      <div class="container">
        <legend>Dane dotyczace nauczyciela koordynujacego przebieg konkursu w szkole:</legend>
        <div class="w-100">
          <label for="titles">Wybierz tytuł:</label>
          <select id="titles-coordinator" v-model="form.coordinator.title">
            <option value="0">Wybierz tytuł</option>
            <option v-for="title in titles" :value="title.id"> {{ title.name }}</option>
          </select>
        </div>
        <div class="w-100">
          <label for="imn">Imie:</label>
          <input v-model="form.coordinator.firstname" type="text" name="imn" placeholder="Imie">
        </div>
        <div class="w-100">
          <label for="nazn">Nazwisko:</label>
          <input v-model="form.coordinator.lastname" type="text" name="nazn" placeholder="Nazwisko">
        </div>
        <div class="w-100">
          <label for="coordinatorEmail">E-email:</label>
          <Field :validateOnInput="true" v-model="form.coordinator.email" type="email" name="coordinatorEmail" placeholder="Adres@strona.pl"/>
        </div>
        <ErrorMessage name="coordinatorEmail" />
        <div class="w-100">
          <label for="password">Hasło:</label>
          <Field :validateOnInput="true" v-model="form.coordinator.password" type="password"
            name="password" placeholder="Haslo" />
          </div>
          <ErrorMessage name="password" />
          <div class="w-100">
          <label for="passwordConfirmation">Potwierdź hasło:</label>
          <Field  :validateOnInput="true" v-model="form.coordinator.confirmPassword"
            type="password" name="passwordConfirmation" placeholder="Potwierdź hasło" />
        </div>
        <ErrorMessage name="passwordConfirmation" />
        <div class="w-100">
          <label for="tel">Telefon:</label>
          <input v-model="form.coordinator.phone" type="number" name="tel" placeholder="+48 000 000 000">
        </div>
        <div>
          <label for="wantsToRate">Prosimy o zaznaczenie poniższego pola w przypadku chęci udziału koordynatora w
            pracach
            Komisji Sprawdzającej prace uczestników konkursu z etapu finałowego w swoim regionie.
            Na podstawie powyższej deklaracji Przewodniczący RKO MK „MBG” będzie mógł w razie potrzeby zaprosić
            koordynatora do udziału w sprawdzaniu prac konkursowych.
            O faktycznym udziale w pracach Komisji koordynator zdecyduje przyjmując bądź odrzucając otrzymane
            zaproszenie.
            Jednocześnie informujemy, że wszystkie osoby zaangażowane w organizację i przebieg konkursu działają na
            zasadzie wolontariatu. Deklaracja współpracy jest całkowicie dobrowolna</label>
        </div>
        <input type="checkbox" id="wantsToRate" v-model="form.coordinator.wantsToRate" />
      </div>

      <div class="container"> 
        <legend>Dane dotyczace Nauczyciela:</legend>
        <div class="w-100">
          <label for="titles">Tytuł:</label>
          <select id="titles-teacher" v-model="form.schoolClass.title">
            <option value="0">Wybierz tytuł</option>
            <option v-for="title in titles" :value="title.id" >{{ title.name }}</option>
          </select>
        </div>
        <div class="w-100">
          <label for="first">Imie:</label>
          <input v-model="form.schoolClass.firstname" type="text" name="firstname" placeholder="Imie">
        </div>
        <div class="w-100">
          <label for="last">Nazwisko:</label>
          <input v-model="form.schoolClass.lastname" type="text" name="lastname" placeholder="Nazwisko">
        </div>

        <legend>Dane dotyczace klasy:</legend>
        <div class="w-100">
          <label for="nazwaKlasy">Nazwa klasy:</label>
          <input v-model="form.schoolClass.name" type="text" name="className" placeholder="Nazwa klasy">
        </div>
        <div class="w-100">
          <label for="iloscUczniow">Ilość uczniów:</label>
          <input v-model="form.schoolClass.students" type="text" name="count" placeholder="Ilość uczniów">
        </div>
        <div class="w-100">
          <label for="language">Preferowany język:</label>
          <select id="language-class" v-model="form.schoolClass.language">
          <option value="0">Wybierz język</option>
          <option v-for="language in languages" :value="language.id">{{ language.name }}</option>
          </select>
        </div>
      </div>


      <div class="buttons">
        <button>wyślij</button>
      </div>
    </form>
  </div>
</template>

<style>
.pageA4 {
  color: rgb(0, 0, 0);
  background-color: #ffffff;
  border-radius: 20px;
}
form h1{
  text-align: center;
}
.container {
  background-color: lightgray;
  margin: 1cm;
  padding: 3mm;
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
  row-gap: 1mm;
  justify-content: 0;
}

.buttons {
  display: flex;
  margin: auto;
  margin: 3%;
  gap: 10%;
  justify-content: center; 
}

.err{
  float: right;
}
</style>