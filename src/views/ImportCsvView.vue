<!-- <template>
    <div class="container">
        <div>
            <v-btn href="http://localhost:8080/users/import">Importuj użytkowników z pliku CSV </v-btn>
        </div>
        <div>
            <v-btn href="http://localhost:8080/form/import">Importuj formularze z pliku CSV </v-btn>
        </div>
        <div>
            <v-btn href="http://localhost:8080/counties/import">Importuj regiony z pliku CSV </v-btn>
        </div>
        <div>
            <v-btn href="http://localhost:8080/regions/import">Importuj regiony z pliku CSV </v-btn>
        </div>
    </div>
</template>
<style>
.container div {
    margin: 10px;
}
</style> -->
<template>
  <div class="d-flex flex-column w-50 bg-white">
    <v-file-input label="Wybierz plik" @change="handleFileUpload($event)" type="file" variant="underlined"></v-file-input>
    <v-btn @click="uploadFile">Importuj</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file:{},
      fileNameWithoutExtension: ''
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0]; // Pobierz pierwszy plik z przekazanych plików
      this.fileNameWithoutExtension =  this.file.name.split('.')[0] // Przypisz nazwę pliku do this.fileName
    },
    uploadFile() {
      try {
        const formData = new FormData();
        formData.append('file', this.file); // this.file zawiera przesłany plik
        this.axios.post(`http://localhost:8080/${this.fileNameWithoutExtension}/import`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Ustaw nagłówek Content-Type
          }
        })
            .then(response => {
              alert('Pomyślnie przesłano plik:', response.data);
            })
            .catch(error => {
              alert('Wystąpił błąd podczas przesyłania pliku:', error);
            });
      } catch (error) {
        console.error('Wystąpił błąd:', error);
      }
    }

  }
};
</script>