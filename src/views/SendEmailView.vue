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
      subjectRules: [(v) => !!v || "Temat jest wymagany"],
      textRules: [(v) => !!v || "Tekst jest wymagany"],
      to:[],
      valid: false,
      isAlertVisible: false,
      form: {
        to: null,
        subject: "",
        text: "",
      },
    };
  },
  beforeMount(){
    this.axios.get(`http://localhost:8080/roles`).then((response) => {
      const mappedRoles = response.data.map(role => {
        switch (role.name) {
          case 'ROLE_ADMIN':
            return { id: role.id, name: 'Admini' };
          case 'ROLE_COORDINATOR':
            return { id: role.id, name: 'Koordynatorzy' };
          case 'ROLE_COORDINATOR_REGION':
            return { id: role.id, name: 'Koordynatorzy regionu' };
          case 'ROLE_COORDINATOR_SCHOOL':
            return { id: role.id, name: 'Koordynatorzy szkolni' };
          default:
            return role;
        }
      });
      this.to = mappedRoles;
    });

  },
  methods: {
    onSubmit(to, subject, text) {
      this.showAlert()
      setTimeout(() => {
        this.axios
          .post(`http://localhost:8080/emails/send/roles/?to=${to}&subject=${subject}&text=${text}`, this.form)
          .then((response) => {
            alert("Wiadomość została wysłana.");
            this.formResponse = response.data
          })
          .catch((err) => {
            alert("Wystąpił nieoczekiwany błąd.");
          });
      }, 2000);
    },
    async validate() {
      const { valid } = await this.$refs.form.validate();
      this.valid = valid;
    },
    showAlert() {
      this.isAlertVisible = true;
      setTimeout(() => {
        this.isAlertVisible = false;
      }, 3000);
    },
  },
};
</script>

<template>
    <v-Form ref="form" @input="validate" @submit.prevent="onSubmit(form.to, form.subject, form.text)">
        <h1 style="text-align: center;">Wyślij wiadomość</h1>
        <h2 style="text-align: center;" v-if="isAlertVisible" class="alert">Prosimy o chwilę cierpliwości...</h2>
        <div class="pageA4" style="width: 100%; min-width: 300px; display: flex; flex-direction: column">
            <v-autocomplete
            v-model="form.to"
            :items="to"
            item-value="id"
            item-title="name"
            label="Do"
            multiple
            required
            ></v-autocomplete>
            <v-text-field
            v-model="form.subject"
            :rules="subjectRules"
            label="Temat"
            required
            ></v-text-field>
            <v-text-field
            v-model="form.text"
            :rules="textRules"
            label="Treść wiadomości"
            required
            ></v-text-field>
          <v-btn color="success" block type="submit" :disabled="!valid">Wyślij</v-btn>
        </div>
    {{ form }}
    </v-Form>
</template>
