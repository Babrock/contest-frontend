<script>
export default {
  data() {
    return {
      formId: null,
      pdfUrl: null,
      signPdfUrl: null
    };
  },
  methods: {
    async downloadPdf() {
      try {
        const response = await this.axios.get(`http://localhost:8080/form/${this.formId}/pdf`, {
          responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        this.pdfUrl = url;
      } catch (error) {
        console.error('Błąd podczas pobierania PDF-a:', error);
      }
    },
    async downloadSignPdf() {
      try {
        const response = await this.axios.get(`http://localhost:8080/form/${this.formId}/signpdf`, {
          responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        this.signPdfUrl = url;
      } catch (error) {
        console.error('Błąd podczas pobierania PDF-a:', error);
      }
    }
  }
};
</script>

<template>
  <div>
    <v-text-field
        v-model="formId"
        label="Numer formularza"
        required
    ></v-text-field>
  <div class="d-flex ga-5">
    <v-btn @click="downloadPdf">Pobierz PDF Formularza</v-btn>
    <v-btn @click="downloadSignPdf">Pobierz PDF z podpisem</v-btn>
  </div>
    <div>
      <iframe v-if="pdfUrl" :src="pdfUrl" width="600" height="800"></iframe>
      <iframe v-if="signPdfUrl" :src="signPdfUrl" width="600" height="800"></iframe>
    </div>
  </div>
</template>


