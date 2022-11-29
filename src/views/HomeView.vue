<script>
import { watch } from 'vue';

export default {
  data() {
    return {
      voivodeships: [],
      counties: [],
      form: {
        voivodeship: 0,
        county: 0,
      }
    }
  },
  mounted() {
    this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
      this.voivodeships = response.data
    })
  },
  watch:{
    "form.voivodeship"(value){
      this.axios.get(`http://localhost:8080/voivodeships/${value}/counties`).then((response) => {
        this.counties = response.data
      }) 
    }
  },
}
</script>
<template>
  <label for="voivodeships">Wybierz województwo:</label>
  <select id ="voivodeships" v-model="form.voivodeship">
    <option v-for="voivodeship in voivodeships" :value="voivodeship.idVoivodeship"> {{ voivodeship.name }} </option>
  </select>

  <label for="counties">Wybierz powiat:</label>
  <select id = "counties" v-model="form.county">
    <option v-for="county in counties" :value="county.idCounty"> {{ county.name }} </option>
  </select>

  {{form}}
</template>