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
        { title: 'Województwo', key: 'form.school.city.community.county.voivodeship.name' },
        { title: 'Powiat', key: 'form.school.city.community.county.name' },
        { title: 'Gmina', key: 'form.school.city.community.name' },
        
        { title: 'Miasto', key: 'form.school.city.name' },
        
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
  async mounted(){
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const response = await this.axios.get(`http://localhost:8080/classes/accepted`);
      this.schoolclasses = response.data;
    },
  },
}
</script>

<template>
  <v-data-table  :headers="headers" :items="schoolclasses" item-value="name" class="elevation-1" multi-sort> </v-data-table>
</template>

<style>

</style>