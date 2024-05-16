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
      nameRules: [(v) => !!v || "Nazwa jest wymagana"],
      valid: false,
      form: {
        name: "",
        startDate: new Date(),
        endDate: new Date(),
      },
    };
  },
  methods: {
    formatDate(date) {
      // Pobierz ró¿nicê czasu w minutach dla twojej strefy czasowej
      const offsetMinutes = new Date().getTimezoneOffset();
      // Dodaj ró¿nicê czasu do daty, aby uzyskaæ lokaln¹ datê
      const localDate = new Date(date.getTime() - (offsetMinutes * 60000));
      // Formatuj datê jako ³añcuch znaków w formacie "YYYY-MM-DD"
      return localDate.toISOString().split('T')[0];
    },
    onSubmit() {
      const formData = {
        ...this.form,
        startDate: this.formatDate(this.form.startDate),
        endDate: this.formatDate(this.form.endDate)
      };
      this.axios
          .post(`http://localhost:8080/editions`, formData)
          .then((response) => {
            alert("Wiadomoœæ zosta³a wys³ana.");
            this.formResponse = response.data
          })
          .catch((err) => {
            alert("Wyst¹pi³ nieoczekiwany b³¹d.");
          });
    },
    async validate() {
      const { valid } = await this.$refs.form.validate();
      this.valid = valid;
    },
  },
};
</script>

<template>
  <div class="h-100 d-flex flex-column bg-white">
    <v-Form ref="form" @input="validate" @submit.prevent="onSubmit">
      <h1>Dodaj now¹ edycjê</h1>
      <div class="pageA4" style="width: 100%; min-width: 300px; display: flex; flex-direction: column">
        <v-text-field
            v-model="form.name"
            :rules="nameRules"
            label="Nazwa"
            required
        ></v-text-field>
        <v-date-picker
            v-model="form.startDate"
            required
            color="primary"
            show-adjacent-months
            title="Wybierz Data rozpoczêcia"
        ></v-date-picker>
        <v-date-picker
            v-model="form.endDate"
            required
            color="primary"
            show-adjacent-months
            title="Wybierz Data zakoñczenia"
        ></v-date-picker>
        <v-btn color="success" block type="submit" :disabled="!valid">Wyœlij</v-btn>
      </div>
    </v-Form>
  </div>
</template>
