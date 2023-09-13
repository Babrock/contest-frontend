<script>
export default {
  data() {
    return {
      voivodeships: [],
      tasks: [],
      sum: 0,
      selectedVoivodeship: null,
      itemsPerPage: 5,
      headers: [
        {
          title: 'Punkty',
          key: 'score',
        },
        { title: 'Klasa', key: 'name' },
        { title: 'Liczba uczniów', key: 'schoolClass.students' },
        { title: 'Nauczyciel', key: 'schoolClass.teacher' },
        { title: 'Nazwa szkoły', key: 'schoolClass.school.name' },
      ],
    }
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
      this.voivodeships = response.data
    })
    this.axios.get(`http://localhost:8080/tasks`).then((response) => {
      this.tasks = response.data
    })
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  methods: {
        editItem (item) {
          this.editedIndex = this.desserts.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true
        },
  
        deleteItem (item) {
          this.editedIndex = this.desserts.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialogDelete = true
        },
  
        deleteItemConfirm () {
          this.desserts.splice(this.editedIndex, 1)
          this.closeDelete()
        },
  
        close () {
          this.dialog = false
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
          })
        },
  
        closeDelete () {
          this.dialogDelete = false
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
          })
        },
  
        save () {
          if (this.editedIndex > -1) {
            Object.assign(this.desserts[this.editedIndex], this.editedItem)
          } else {
            this.desserts.push(this.editedItem)
          }
          this.close()
        },
      },
}
</script>

<template>
  <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="tasks" item-value="name"
class="elevation-1">
  </v-data-table>
</template>

<style></style>