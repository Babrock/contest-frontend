<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
            v-model="formId"
            label="Numer formularza"
            required
        ></v-text-field>
        <v-file-input
            v-model="file"
            label="Wybierz plik PDF do przesłania"
            show-size
            accept="application/pdf"
            outlined
        ></v-file-input>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-btn @click="uploadPdf" color="primary" :disabled="!file">Prześlij PDF</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="pdfUrl">
      <v-col cols="12">
        <iframe :src="pdfUrl" width="100%" height="600px"></iframe>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="3000">{{ snackbarMessage }}</v-snackbar>
  </v-container>
</template>

<script>

export default {
  data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      formId:null,
      file: null,
      pdfUrl: null
    };
  },
  methods: {
    async uploadPdf() {
      const formData = new FormData();
      formData.append('formSignPdf', this.file);
      this.axios
          .post(`http://localhost:8080/form/${this.formId}/addSignPdf`, formData,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => {
            this.pdfUrl = response.data.pdfUrl;
            this.snackbarMessage = ("Formularz został zgłoszony.")
            this.formResponse = response.data
            this.snackbar = true
          })
          .catch(() => {
            this.snackbarMessage = ("Wystąpił nieoczekiwany błąd.")
            this.snackbar = true
          });
    }
  }
};
</script>