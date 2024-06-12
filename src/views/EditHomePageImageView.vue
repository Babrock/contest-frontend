<template>
  <v-data-table
      class="d-flex flex-column w-50 h-100 bg-white pa-1 pa-sm-5"
      :headers="headers"
      :items="homePageImages"
      :sort-by="[{ key: 'calories', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar
          flat
      >
        <v-toolbar-title>Zdjęcia</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
        <v-dialog
            v-model="dialog"
            max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
                class=" mb-2"
                color="primary"
                dark
                v-bind="props"
            >
              Dodaj zdjęcie
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-file-input label="Wybierz zdjęcie" type="file" @change="onFileChange"/>
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
                anuluj
              </v-btn>
              <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="onSubmit"
              >
                zapisz
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
      <v-icon
          size="small"
          @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
      <v-snackbar v-model="snackbar" :timeout="3000">{{ snackbarMessage }}</v-snackbar>
    </template>
    <template v-slot:item.image="{ item }">
      <img :src="'data:image/png;base64,' + item.image" width="100" height="100">
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ['editionId', 'selected-edition'],
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          title: 'Nazwa',
          align: 'start',
          sortable: false,
          key: 'name',
        },
        {title: 'Zdjęcie', key: 'image'},
        {title: 'Opcje', key: 'actions', sortable: false},
      ],
      editedIndex: -1,
      snackbar: false,
      snackbarMessage: "",
      defaultItem: {
        image: null,
        homePageId: null,
      },
      homePageImages: [],
    };
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/home-page/edition/${this.editionId}`).then((response) => {
      this.defaultItem.homePageId = response.data.id;
      this.fetchHomePageImages();
    });
  },
  computed: {
    formTitle() {
      return 'Nowe zdjęcie'
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
    fetchHomePageImages() {
      if (this.defaultItem.homePageId) {
        this.axios.get(`http://localhost:8080/home-page-image/home-page/${this.defaultItem.homePageId}`).then((response) => {
          this.homePageImages = response.data;
        });
      }
    },
    onFileChange(event) {
      this.defaultItem.image = event.target.files[0];
    },
    onSubmit() {
      const formData = new FormData();
      formData.append('image', this.defaultItem.image);
      formData.append('homePage', this.defaultItem.homePageId);

      this.axios.post("http://localhost:8080/home-page-image", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then((response) => {
            this.snackbarMessage = ("Zdjęcie został dodane.")
            this.snackbar = true
          })
          .catch((err) => {
            this.snackbarMessage = ("Wystąpił nieoczekiwany błąd.")
            this.snackbar = true
          });
      this.fetchHomePageImages();
    },

    deleteItem(item) {
      this.editedIndex = this.homePageImages.indexOf(item)
      this.defaultItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.homePageImages.splice(this.editedIndex, 1)
      this.axios.delete(`http://localhost:8080/home-page-image/${this.defaultItem.id}`)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.defaultItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.defaultItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
};
</script>


