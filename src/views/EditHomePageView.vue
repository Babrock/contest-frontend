<script>
export default {
  props: ['editionId' , 'selected-edition'],
  data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      homePageId: null,
      form: {
        edition: 1,
        contents: ""
      }
    }
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/home-page/edition/${this.editionId}`).then((response) => {
      this.form.contents = response.data.contents;
      this.homePageId = response.data.id;
    });
  },
  methods: {
    send() {
      if(this.homePageId == null){
        this.axios.post("http://localhost:8080/home-page", this.form)
            .then((response) => {
              this.snackbarMessage = ("Formularz został zgłoszony.")
              this.snackbar = true
            })
            .catch((err) => {
              this.snackbarMessage = ("Wystąpił nieoczekiwany błąd.")
              this.snackbar = true
            });
      }else{
        this.axios.put(`http://localhost:8080/home-page/${this.homePageId}`, this.form)
            .then((response) => {
              this.snackbarMessage = ("Formularz został zaktualizowany.")
              this.snackbar = true
            })
            .catch((err) => {
              this.snackbarMessage = ("Wystąpił nieoczekiwany błąd.")
              this.snackbar = true
            });
      }

    }
  },
}
</script>

<template>
  <div class="d-flex flex-column w-100 h-100 bg-white pa-1 pa-sm-5">
    <div>
      <v-textarea
          class="w-sm-15 w-100 h-25"
          v-model="form.contents"
          label="Tekst strony w html"
          rows="25"
          required
      ></v-textarea>
    </div>
    <v-btn @click="send"> zapisz</v-btn>
    <v-snackbar v-model="snackbar" :timeout="3000">{{ snackbarMessage }}</v-snackbar>
  </div>
</template>
