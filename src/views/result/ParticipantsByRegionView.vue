<script>
export default {
  data() {
    return {
        schoolclasses:[],
        headers: [
        {
          title: 'Szkoła',
          key: 'form.school.name',
        },
        { title: 'Kategoria', key: 'form.schoolDetails.schoolType.name' },
        { title: 'Kategoria', key: 'form.schoolDetails.category.name' },
        { title: 'Region', key: 'form.schoolDetails.region.name' },
        { title: 'Województwo', key: 'form.school.voivodeship' },
        { title: 'Powiat', key: 'form.school.county' },
        { title: 'Gmina', key: 'form.school.community' },
        { title: 'Miasto', key: 'form.school.city' },
        
        { title: 'Nazwa klasy', key: 'name' },
        { title: 'Język', key: 'language.name' },

        { title: 'Tytuł Koordynatora', key: 'form.user.title.name', sortable: false },
        { title: 'Imie Koordynatora', key: 'form.user.firstname', sortable: false },
        { title: 'Nazwisko Koordynatora', key: 'form.user.lastname' },
      ],
    }
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/classes/accepted`).then((response) => {
      this.schoolclasses = response.data
      console.log(this.schoolclasses)
    })
  },
  mounted(){
    this.fetchData();
    this.setupAutoRefresh(); // Setup auto-refresh
  },
  methods: {
    async fetchData() {
      const response = await this.axios.get(`http://localhost:8080/classes/accepted`);
      this.schoolclasses = response.data;
    },
    setupAutoRefresh() {
      // Refresh every 5 seconds (adjust the interval as needed)
      setInterval(() => {
        this.fetchData();
      }, 3000); 
    },
  },
}
</script>

<template>
  <v-data-table style="min-width: 100%;" :headers="headers" :items="schoolclasses" item-value="name" class="elevation-1"> </v-data-table>
</template>

<style>

</style>