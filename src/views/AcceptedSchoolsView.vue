<script>
import { mapWritableState, mapState } from 'pinia'
import {useAuthStore} from '@/store/auth.js'
import NavigationBar from "@/components/NavigationBar.vue";

export default {
  components: {
    NavigationBar
  },
  props: {
    editionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      selectedId: null,
      schoolclasses:[],
      headers: [
        {
          title: 'Szkoła',
          key: 'form.school.name',
        },
        // { title: 'Numer formularza', key: 'form.id', show: this.shouldShowFormId },

        { title: 'Typ szkoły', key: 'schoolClassNumber.schoolType.name'},
        { title: 'Numer klasy', key: 'schoolClassNumber.name' },
        { title: 'Nazwa klasy', key: 'name' },

        { title: 'Kategoria', key: 'schoolClassNumber.schoolType.category.name' },

        { title: 'Region', key: 'form.schoolDetails.region.name' },
        { title: 'Województwo', key: 'form.school.city.community.county.voivodeship.name' },
        { title: 'Powiat', key: 'form.school.city.community.county.name' },
        { title: 'Gmina', key: 'form.school.city.community.name' },
        { title: 'Miasto', key: 'form.school.city.name' },

        { title: 'Język', key: 'language.name' },

        { title: 'Koordynator Szkolny', key: 'form.user.user', sortable: false },
      ],
    }
  },
  computed: {
    ...mapWritableState(useAuthStore, ['isAuthenticated']),
    ...mapState(useAuthStore, ['role']),

    shouldShowFormId() {
      return this.isAuthenticated || this.role === 'ROLE_ADMIN' || this.role === 'ROLE_COORDINATOR';
    }
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/classes/accepted/${this.editionId}`).then((response) => {
      this.schoolclasses = response.data
    })
  },
   async mounted(){
     await this.fetchData();
  },
  methods: {
    async fetchData() {
      const response = await this.axios.get(`http://localhost:8080/classes/accepted/${this.editionId}`);
      this.schoolclasses = response.data;
    },
    handleSelectedId(selectedId) {
      console.log("Selected ID:", selectedId); // Wyświetl wartość selectedId w konsoli
    },
  },
}
</script>

<template>
  <v-data-table :headers="headers" :items="schoolclasses" item-value="name" class="h-100 elevation-1" multi-sort> </v-data-table>
</template>

<style>

</style>