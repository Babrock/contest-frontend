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
          title: 'Nazwa',
          align: 'start',
          key: 'name',
        },
        { title: 'Województwa', key: 'voivodeships' },
        { title: 'Powiaty', key: 'counties' },
        { title: '', key: 'actions', sortable: false },
      ],
      editedIndex: -1,
      itemToEdit:{
        name:"",
        voivodeships:[],
        counties:[],
      },
      defaultItem:{
        name:"",
        voivodeships:[],
        counties:[],
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
      this.regions.forEach((region) => {
          region.voivodeships = region.voivodeships.slice(1, -1)
          region.counties = region.counties.slice(1, -1)
        });
    });
    this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
    this.voivodeships = response.data;
  }).catch((error) => {
    console.error('Error fetching voivodeships:', error);
  });
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    "itemToEdit.voivodeships"(value) {
      if (value === null) return;
      this.axios
        .get(`http://localhost:8080/counties/voivodeships-names/${value}`)
        .then((response) => {
          this.counties = response.data;
        }).catch((error) => {
        console.error('Error in GET request:', error);
        // Handle the error, show a user-friendly message, etc.
      });
    },
  },
  methods: {
    editItem(item) {
  this.editedIndex = this.regions.indexOf(item);
  const regionsAtIndex = this.regions?.[this.editedIndex];
  if ( regionsAtIndex) {
    this.itemToEdit = Object.assign({}, regionsAtIndex);
    this.dialog = true;
  } else {
    console.error("Invalid index or arrays are not properly defined.");
  }
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

    save() {
      if (this.editedIndex > -1) {
          const { id, ...itemWithoutId } = this.itemToEdit;
          itemWithoutId.voivodeships = itemWithoutId.voivodeships.split(',').map(item => item.trim());
          itemWithoutId.counties = itemWithoutId.counties.split(',').map(item => item.trim());

          this.axios.put(`http://localhost:8080/regions/${this.itemToEdit.id}`, itemWithoutId)
          console.log(itemWithoutId)
        } else {
          this.axios.post('http://localhost:8080/regions', this.itemToEdit)
        }
        this.close()
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
  <v-sheet class="mx-auto">
    <div class="pageA4">
      <v-data-table :headers="headers" :items="regions" :sort-by="[{ key: 'voivodeships', order: 'asc' }]">
        <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>REGIONY</v-toolbar-title>
        {{ itemToEdit }}
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="props"
            >
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
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  <v-text-field
                    v-model="itemToEdit.name"
                    label="Nazwa"
                    required
                  ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  <v-autocomplete
                    @update:modelValue="itemToEdit.counties = []"
                    v-model="itemToEdit.voivodeships"
                    :items="voivodeships"
                    item-value="name"
                    item-title="name"
                    chips
                    label="Województwa"
                    multiple
                  ></v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  <v-autocomplete
                    :disabled="itemToEdit.voivodeships.length < 1"
                    v-model="itemToEdit.counties"
                    :items="counties"
                    item-value="name"
                    item-title="name"
                    chips
                    label="Powiaty"
                    multiple
                  ></v-autocomplete>  
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
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
  </v-sheet>
</template>
