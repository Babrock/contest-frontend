<script>
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      regions:[],
      voivodeships:[],
      counties:[],
      headers: [
        {
          title: 'Numer',
          align: 'start',
          key: 'id',
        },
        { title: 'Nazwa', key: 'name' },
        { title: 'Województwa', key: 'voivodeships' },
        { title: 'Powiaty', key: 'counties' },
        { title: '', key: 'actions', sortable: false },
      ],
      editedIndex: -1,
      itemToEdit:{
        name:"",
        countiesIds:[],
      },
      defaultItem:{
        name:"",
        countiesIds:[],
      },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nowy region' : 'Edytuj Region'
    },
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/regions`).then((response) => {
      this.regions = response.data;
      });
    this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
      this.voivodeships = response.data;
    });
  },
  mounted() {
    this.fetchData();
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
    selectAll(){
      this.itemToEdit.countiesIds = this.counties.map(county => county.id);
    },
    
    async fetchData() {
      const response = await this.axios.get(`http://localhost:8080/regions`);
      this.regions = response.data;
    },

    handleVoivodeshipChange(voivodeshipsIds){
      voivodeshipsIds = voivodeshipsIds.join(',');
      this.axios.get(`http://localhost:8080/counties/voivodeships/${voivodeshipsIds}`).then((response) => {
        this.counties = response.data
      })
    },

    async editItem(item) {
    // Pobierz szczegóły regionu z bazy danych na podstawie jego ID
    const response = await this.axios.get(`http://localhost:8080/regions/${item.id}`);
    this.itemToEdit = response.data;
    const { id, ...itemWithoutId } = this.itemToEdit;

    // Ustaw indeks edytowanego elementu
    this.editedIndex = this.regions.indexOf(item);
    // Otwórz dialog edycji
    this.dialog = true;
  },

    deleteItem(item) {
      this.editedIndex = this.regions.indexOf(item)
      this.itemToEdit = Object.assign({}, this.regions[this.editedIndex])
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.regions.splice(this.editedIndex, 1)
      this.axios.delete(`http://localhost:8080/regions/${this.itemToEdit.id}`)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.itemToEdit = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.itemToEdit = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      if (this.editedIndex > -1) {
        await  this.axios.put(`http://localhost:8080/regions/${this.itemToEdit.id}`, this.itemToEdit)
        } else {
          await  this.axios.post('http://localhost:8080/regions/', this.itemToEdit)
        }
        this.close()
        this.fetchData();
    },

    onSubmit(values) {
      if (window.confirm("Czy potwierdzasz zgodność danych?")) {
        this.axios
          .post("http://localhost:8080/regions", this.form)
          .then((response) => {
            alert("Formularz został zgłoszony.");
            this.formResponse = response.data
          })
          .catch((err) => {
            alert("Wystąpił nieoczekiwany błąd.");
          });
      }
    },
  }
}
</script>
<template>
    <div class="h-100 w-100 bg-white pa-1 pa-sm-5">
      <v-data-table :headers="headers" :items="regions" :sort-by="[{ key: 'name', order: 'asc' }]">
        <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>REGIONY</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-dialog v-model="dialog" max-width="500px">
  <template v-slot:activator="{ props }">
    <v-btn color="primary" dark class="mb-2" v-bind="props">
      Nowy Region
    </v-btn>
  </template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ formTitle }}</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field v-model="itemToEdit.name" label="Nazwa" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-autocomplete
              @update:modelValue="handleVoivodeshipChange"
              v-model="itemToEdit.voivodeships"
              :items="voivodeships"
              item-value="id"
              item-title="name"
              chips
              label="Województwa"
              multiple
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-autocomplete
              v-model="itemToEdit.countiesIds"
              :items="counties"
              item-value="id"
              item-title="name"
              chips
              label="Powiaty"
              multiple
            ></v-autocomplete> 
            <v-btn @click="selectAll" >Wszystkie Powiaty</v-btn> 
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
      <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Czy na pewno chcesz usunąć ten region?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Nie</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">TAK</v-btn>
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
      </v-data-table>
    </div>
</template>
