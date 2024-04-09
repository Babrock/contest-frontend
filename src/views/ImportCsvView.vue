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
    <div>
      <input type="file" @change="handleFileUpload">
      <button @click="uploadFile">Upload</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        file: null,
        fileName: ''
      };
    },
    methods: {
      handleFileUpload(event) {
        this.file = event.target.files[0];
        this.fileName = this.file.name;
      },
      async uploadFile() {
        if (!this.file) {
          console.error('Nie wybrano pliku.');
          return;
        }
  
        const formData = new FormData();
        formData.append('file', this.file);
  
        const url = `http://localhost:8080/counties/import`;
  
        try {
          const response = await fetch(url, {
            method: 'POST',
            body: formData
          });
  
          if (response.ok) {
            console.log('Plik został pomyślnie przesłany.');
            // Tutaj możesz dodać kod obsługi po pomyślnym przesłaniu pliku
          } else {
            console.error('Wystąpił błąd podczas przesyłania pliku.');
            // Tutaj możesz dodać kod obsługi w przypadku błędu
          }
        } catch (error) {
          console.error('Wystąpił błąd:', error);
          // Tutaj możesz dodać kod obsługi błędu sieciowego
        }
      }
    }
  };
  </script>
  