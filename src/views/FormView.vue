<script>

export default {
  data() {
    return {
      voivodeships: [],
      counties: [],
      communities: [],
      categories: [],
      form: {
        schoolData: {
          voivodeship: 0,
          county: 0,
          community: 0,
          category: 0,

          city: "",
          complex: "",
          name: "",
          patron: "",
          phone: "",
          mail: "",

          street: "",
          buildingAndPremises: "",
          preciseCity: "",
          post: "",
        },

        headmaster: {
          title: "",
          firstname: "",
          lastname: "",
          mail: "",
        },

        coordinator: {
          title: "",
          firstname: "",
          lastname: "",
          mail: "",
          phone: "",
          wantsToRate: 0,
        }


      }
    }
  },
  mounted() {
    this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
      this.voivodeships = response.data
    }),
      this.axios.get(`http://localhost:8080/categories`).then((response) => {
        this.categories = response.data
      }),
      this.axios.get(`http://localhost:8080/titles`).then((response) => {
        this.titles = response.data
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
    onSubmit() {
      this.axios.post('http://localhost:8080/form', this.form).then(response => {
        alert("Formularz został zgłoszony.")
      }).catch(err => {
        alert('Wystąpił nieoczekiwany błąd.')
      })
    }
  }
}
</script>

<template>
  <div class="pageA4">
    <form @submit.prevent="onSubmit">
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
          <label for="em">E-mail:</label>
          <input v-model="form.schoolData.mail" type="email" name="em" placeholder="adres@strona.pl">
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
            <select id="titles" v-model="form.headmaster.title">
              <option value="0">Wybierz tytuł</option>
              <option v-for="title in titles" :value="title.id"> {{ title.name }}</option>
            </select>
          </div>
        <div class="w-100">
          <label for="im">Imie:</label>
          <input v-model="form.headmaster.firstname" type="text" name="im" placeholder="Imie">
        </div>
        <div class="w-100">
          <label for="naz">Nazwisko:</label>
          <input v-model="form.headmaster.lastname" type="text" name="naz" placeholder="Nazwisko">
        </div>
        <div class="w-100">
          <label for="emn">E-mail:</label>
          <input v-model="form.headmaster.mail" type="email" name="emn" placeholder="adres@strona.pl">
        </div>
      </div>

      <div class="container">
        <legend>Dane dotyczace nauczyciela koordynujacego przebieg konkursu w szkole:</legend>
        <div class="w-100">
            <label for="titles">Wybierz tytuł:</label>
            <select id="titles" v-model="form.coordinator.title">
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
          <label for="emn">E-mail:</label>
          <input v-model="form.coordinator.mail" type="email" name="emn" placeholder="adres@strona.pl">
        </div>
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
<!--         
        <legend>Dane dotyczace Nauczyciela:</legend>
        <div class="w-100">
          <label for="tyt">Tytuł:</label>
          <input v-model="form.headmaster.title" type="text" name="tyt" placeholder="Tytuł">
        </div>
        <div class="w-100">
          <label for="imn">Imie:</label>
          <input v-model="form.coordinator.firstname" type="text" name="imn" placeholder="Imie">
        </div>
        <div class="w-100">
          <label for="imn">Nazwisko:</label>
          <input v-model="form.coordinator.firstname" type="text" name="imn" placeholder="Imie">
        </div> -->

        <!-- <legend>Dane dotyczace klasy:</legend>
        <div class="w-100">
          <label for="nazwaKlasy">Nazwa klasy:</label>
          <input v-model="form.coordinator.firstname" type="text" name="imn" placeholder="Imie">
        </div>
        <div class="w-100">
          <label for="iloscUczniow">Ilość uczniów:</label>
          <input v-model="form.coordinator.firstname" type="text" name="imn" placeholder="Imie">
        </div>
        <div class="w-100">
          <label for="prefJezyk">Preferowany język:</label>
          <input v-model="form.coordinator.firstname" type="text" name="imn" placeholder="Imie">
        </div> -->
      </div>
      
      <div class="buttons">
        <div>
          <input type="submit" value="Wyślij">
        </div>
      </div>

      <div>
        {{ form }}
      </div>
    </form>
  </div>
</template>

<style>
.pageA4 {
  margin: auto;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 2%;
  color: rgb(0, 0, 0);
  background-color: #ffffff;
  border-radius: 20px;
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

.container input {
  width: 80%;
}

.container label {
  width: 10%;
}

#wantsToRate {
  width: 50px;
}

.buttons {
  display: flex;
  margin: auto;
  gap: 10%;
  justify-content: center;
}
</style>