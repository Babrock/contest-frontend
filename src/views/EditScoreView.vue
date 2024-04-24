<script>
import {useAuthStore} from '@/store/auth.js'

export default {
  data: () => ({
    forms: [],
    formId: null,
    user: {
      region: {
        id: null,
        name: null,
      },
    },
    voivodeship: null,
    county: null,
    community: null,
    city: null,
    school: {
      id: null,
      name: null,
    },

    schoolClasses: [],
    tasks: [],
    taskswithsumscore: [],
    schoolClass: "",
    itemsPerPage: 15,
    scoresDialog: false,
    dialogDelete: false,
    dialogEditSumScore: false,
    scoreDialog: false,
    headersSumScore: [
      {
        title: 'Nazwa szkoły',
        align: 'start',
        sortable: false,
        key: 'schoolClass.school.name',
      },
      {title: 'Wyniki', key: 'score'},
      {title: 'Nauczyciel', key: 'schoolClass.teacher'},
      {title: 'Klasa', key: 'schoolClass.name'},
      {title: 'Liczba uczniów', key: 'schoolClass.students'},
      {title: 'id klasy', key: 'schoolClass.id'},
      {title: 'Opcje', key: 'actions', sortable: false},
    ],
    headers: [
      {
        title: 'Nazwa zadania',
        align: 'start',
        sortable: true,
        key: 'name',
      },
      {title: 'Punkty', key: 'score'},
      {title: 'Opcje', key: 'actions', sortable: false},
    ],
    editedIndex: -1,
    editedItemId: null,
    editedScores: {
      schoolClass: "",
      name: 0,
      score: 0,
    },
    editedScore: {
      name: 0,
      score: 0,
      schoolClass: "",
    },
    defaultScores: {
      schoolClass: "",
      name: 0,
      score: 0,
    },
    defaultScore: {
      schoolClass: "",
      name: 0,
      score: 0,
    },

  }),
  beforeMount() {
    this.axios.get(`http://localhost:8080/users/details`).then((response) => {
      const data = response.data
      console.log(data)
      if (data.role == "ROLE_ADMIN") {
        this.axios.get(`http://localhost:8080/form/region-id/null`).then((response) => {
          this.forms = response.data;
        });
      } else {
        this.axios.get(`http://localhost:8080/form/region-id/${data.region.id}`).then((response) => {
          this.forms = response.data;
        });
      }
    })
    this.axios.get(`http://localhost:8080/classes`).then((response) => {
      this.schools = response.data
    })
    this.fetchScoresData()
  },
  computed: {
    formTitleSumScore() {
      return this.editedIndex === -1 ? 'Nowy wynik' : 'Edycja wyniku'
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Nowe zadanie' : 'Edycja zadania'
    },
  },
  watch: {
    scoresDialog(val) {
      val || this.closeScores()
    },
    scoreDialog(val) {
      val || this.closeScore()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    "formId"(value) {
      if (value === null) return;
      this.axios.get(`http://localhost:8080/form/form-id/${value}`).then((response) => {
        this.user.region.id = response.data?.[0]?.region?.id
        this.user.region.name = response.data?.[0]?.region?.name
        this.voivodeship = response.data?.[0]?.city?.community?.county?.voivodeship?.name
        this.county = response.data?.[0]?.city?.community?.county?.name
        this.community = response.data?.[0]?.city?.community?.name
        this.city = response.data?.[0]?.city?.name
        this.school.id = response.data?.[0]?.schoolId
        this.school.name = response.data?.[0]?.schoolName
      });
    },
    "school.id"(SchoolId) {
      if (SchoolId !== null && SchoolId !== undefined) {
        this.axios.get(`http://localhost:8080/classes/${SchoolId}`).then((response) => {
          this.schoolClasses = response.data
        })
      }
    },
  },
  methods: {
     fetchScoresData() {
       this.axios.get(`http://localhost:8080/tasks/sum-score`).then((response) => {
        this.taskswithsumscore = response.data
      })
    },
    async fetchScoresForClass(classId){
      let axiosResponse = await this.axios.get(`http://localhost:8080/tasks?schoolClass_id=${classId}`);
      return axiosResponse.data
    },
    editScores(item) {
      this.editedScore.schoolClass = item.schoolClass.id
      this.defaultScore.schoolClass = item.schoolClass.id
      this.axios.get(`http://localhost:8080/tasks?schoolClass_id=${item.schoolClass.id}`).then((response) => {
        this.tasks = response.data
      })
      this.dialogEditSumScore = true
    },
    editScore(item) {
      this.editedIndex = this.tasks.indexOf(item)
      this.editedScore.id = item.id
      this.editedScore.name = item.name;
      this.editedScore.score = item.score;
      this.scoreDialog = true
    },
    deleteScores(item) {
      this.editedIndex = this.taskswithsumscore.indexOf(item)
      this.editedScores = Object.assign({}, this.taskswithsumscore[this.editedIndex])
      this.dialogDelete = true
    },
    deleteScore(item) {
      this.editedIndex = this.tasks.indexOf(item)
      this.editedScore = Object.assign({}, this.tasks[this.editedIndex])
      this.dialogDelete = true
    },
    deleteScoresConfirm() {
      this.taskswithsumscore.splice(this.editedIndex, 1)
      this.axios.delete(`http://localhost:8080/tasks/${this.editedScores.schoolClass.id}`)
      this.closeDelete()
    },
    deleteScoreConfirm() {
      this.tasks.splice(this.editedIndex, 1)
      this.axios.delete(`http://localhost:8080/tasks/task/${this.editedScore.id}`)
      this.closeDelete()
    },
    closeScores() {
      this.scoresDialog = false
      this.$nextTick(() => {
        this.editedScores = Object.assign({}, this.defaultScores)
        this.editedIndex = -1
      })
    },
    closeScore() {
      this.scoreDialog = false
      this.$nextTick(() => {
        this.editedScore = Object.assign({}, this.defaultScore)
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedScores = Object.assign({}, this.defaultScores)
        this.editedScore = Object.assign({}, this.defaultScore)
        this.editedIndex = -1
      })
    },
    async saveScores() {
      function validateValue(value, minValue, maxValue, errorMessage) {
        if (parseInt(value) > maxValue) {
          alert(errorMessage);
          return maxValue;
        }
        if (parseInt(value) < minValue) {
          alert(errorMessage);
          return minValue;
        }
        return parseInt(value);
      }

      this.editedScores.name = validateValue(this.editedScores.name, 0, 20, "Numer zadanie nie może być większy niż 20 lub mniejszy niż 0.");
      this.editedScores.score = validateValue(this.editedScores.score, 0, 100, "Liczba punktów nie może być większa niż 100 lub mniejsza niż 0.");
      try {
        if (this.editedIndex > -1) {
          await this.axios.put(`http://localhost:8080/tasks/${this.editedItemId}`, this.editedScores)
        } else {
          await this.axios.post('http://localhost:8080/tasks/add', this.editedScores)
        }
        this.closeScores()
        this.fetchScoresData()
      } catch (error) {
        if (error.response && error.response.status === 500) {
          alert("Zadanie o takiej nazwie już istnieje.");
        } else {
          alert("Wystąpił błąd podczas komunikacji z serwerem.");
        }
      }
    },
    async saveScore() {
      try {
        if (this.editedIndex > -1) {
          await this.axios.put(`http://localhost:8080/tasks/${this.editedScore.id}`, this.editedScore)
        } else {
          await this.axios.post('http://localhost:8080/tasks/add', this.editedScore)
        }
        this.tasks = await this.fetchScoresForClass(this.editedScore.schoolClass)
        this.closeScore()
      } catch (error) {
        console.log(error.response)
        if (error.response && error.response.data.status === 400 && error.response.data.message === 'ALREADY_EXISTS') {
          alert("Zadanie o takiej nazwie już istnieje.");
        } else {
          alert("Wystąpił błąd podczas komunikacji z serwerem.");
        }
      }
    },

  },
}
</script>

<template>
  <v-data-table v-model:items-per-page="itemsPerPage" :headers="headersSumScore" :items="taskswithsumscore" item-value="name"
                :sort-by="[{ key: 'score', order: 'asc' }]" class="h-100 elevation-1" multi-sort>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Wyniki</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="scoresDialog">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" dark class="mb-2" v-bind="props">
              Nowy wynik
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitleSumScore }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                        label="Wpisz numer formularza"
                        v-model="formId"
                        :items="forms"
                        item-value="id"
                        item-title="formNumber"
                        no-data-text="Nie ma dostępnych danych."
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        label="Region"
                        v-model="user.region.name"
                        readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        label="Województwo"
                        v-model="voivodeship"
                        readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        label="Powiat"
                        v-model="county"
                        readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        label="Gmina"
                        v-model="community"
                        readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        label="Miasto"
                        v-model="city"
                        readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        label="Szkoła"
                        v-model="school.name"
                        readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                        label="Wybierz klasę"
                        v-model="editedScores.schoolClass"
                        :items="schoolClasses"
                        item-value="id"
                        item-title="name"
                        no-data-text="Nie wybrano szkoły"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        v-model="editedScores.name"
                        type="number"
                        min="0"
                        max="20"
                        label="Wpisz numer zadania"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        v-model="editedScores.score"
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        label="Wpisz liczbę punktów"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeScores">
                Zamknij
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="saveScores">
                Zapisz
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Czy na pewno chcesz usunąć ten wynik?</v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Nie</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteScoresConfirm">Tak</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>

        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" @click="editScores(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteScores(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
    </template>
  </v-data-table>


  <v-dialog v-model="dialogEditSumScore" max-width="80%">
    <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="tasks" item-value="name"
                  :sort-by="[{ key: 'score', order: 'asc' }]" class="elevation-1" multi-sort>

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Wyniki</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="scoreDialog">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark class="mb-2" v-bind="props">
                Nowe zadanie
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
                {{ this.editedScore }}
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                          v-model="editedScore.name"
                          type="number"
                          min="0"
                          max="20"
                          label="Wpisz numer zadania"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                          v-model="editedScore.score"
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          label="Wpisz liczbę punktów"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeScore">
                  Zamknij
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="saveScore">
                  Zapisz
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Czy na pewno chcesz usunąć ten wynik?</v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Nie</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteScoreConfirm">Tak</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>

          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editScore(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteScore(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
      </template>
    </v-data-table>
  </v-dialog>


</template>

<style>

</style>