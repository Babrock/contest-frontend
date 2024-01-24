<script>
export default {
  data: () => ({
    schools: [],
    schoolClasses: [],
    selectedSchoolId: null,
    schoolClass: "tu",
    school: 0,
    tasks: [],
    itemsPerPage: 15,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        title: 'Nazwa Szkoły',
        align: 'start',
        sortable: false,
        key: 'schoolClass.school.name',
      },
      { title: 'Nauczyciel', key: 'schoolClass.teacher' },
      { title: 'Klasa', key: 'schoolClass.name' },
      { title: 'Liczba uczniów', key: 'schoolClass.students' },
      { title: 'Numer zadania', key: 'name' },
      { title: 'Punkty', key: 'score' },
      { title: 'Opcje', key: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id_task: 0,
      schoolClass: "editedItem",
      name: 0,
      score: 0,
    },
    defaultItem: {
      id_task: 0,
      schoolClass: "defaultItem",
      name: 0,
      score: 0,
    },
  }),
  beforeMount() {
    this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
      this.voivodeships = response.data
    })
  },

  mounted() {
    this.axios.get(`http://localhost:8080/schools`).then((response) => {
      this.schools = response.data
    })
        this.axios.get(`http://localhost:8080/tasks`).then((response) => {
      this.tasks = response.data
    })
  },


  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nowy wynik' : 'Edit Item'
    },
    schoolOptions() {
      return this.schools.map(school => school.name)
    },
    taskId(){
      return this.tasks.map(tasks => tasks.id)
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    "selectedSchoolId"(value) {
      this.axios.get(`http://localhost:8080/classes?school_id=${value}`).then((response) => {
        this.schoolClasses = response.data
      })
    },
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.tasks.indexOf(item)
      this.editedItem = Object.assign(this.tasks[this.editedIndex], this.tasks[this.editedIndex])
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.tasks.indexOf(item)
      this.editedItem = Object.assign({}, this.tasks[this.editedIndex])
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.tasks.splice(this.editedIndex, 1)
      this.axios.delete(`http://localhost:8080/tasks/${this.editedItem.id}`)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
          this.axios.put(`http://localhost:8080/tasks/${this.editedItem.id}`, this.editedItem)
        } else {
          this.axios.post('http://localhost:8080/tasks/add', this.editedItem)
        }
        this.close()
    },
  },
}
</script>

<template>
  <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="tasks" item-value="name"
    :sort-by="[{ key: 'score', order: 'asc' }]" class="elevation-1">

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Wyniki</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" dark class="mb-2" v-bind="props">
              Nowy wynik
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-select 
                      label="Wybierz szkołe" 
                      v-model="selectedSchoolId" 
                      :items="schools" 
                      item-value="id"
                      item-title="name"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select label="Wybierz klasę" v-model="editedItem.schoolClass" :items="schoolClasses" item-value="id"
                      item-title="name" no-data-text="Nie wybrano szkoły">
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" type="number"  min="0" max="100" label="Numer zadania"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.score" type="number"  min="0" max="100" step="0.5" label="Liczba punktów" ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Anuluj
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
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
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Tak</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>

        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item.raw)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item.raw)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
    </template>
  </v-data-table>
</template>

<style>

</style>