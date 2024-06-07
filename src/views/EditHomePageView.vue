<script>
export default {
  data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      form: {
        edition: 1,
        contents: ""
      }
    }
  },
  methods: {
    send() {
      this.axios.post("http://localhost:8080/home-page", this.form)
          .then((response) => {
            this.snackbarMessage = ("Formularz został zgłoszony.")
            this.snackbar = true
          })
          .catch((err) => {
            this.snackbarMessage = ("Wystąpił nieoczekiwany błąd.")
            this.snackbar = true
          });
    }
  },
}
</script>

<template>
  <div class="d-flex flex-column w-100 h-100 bg-white pa-1 pa-sm-5">
    <div >
      <v-textarea
          class="w-sm-15 w-100 h-25"
          v-model="form.contents"
          label="Tekst strony w html"
          rows="25"
          required
      ></v-textarea>
    </div>
    <v-btn @click="send"> zakoduj</v-btn>
  </div>
</template>
