<script>
export default {
  data() {
    return {
      voivodeships: [],
      selectedVoivodeship: 0,
    }
  },
  mounted() {
    this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
      this.voivodeships = response.data
    })
  }
}
</script>
<template>
  <label for="cars">Wybierz województwo:</label>
  <select v-model="selectedVoivodeship">
    <option v-for="voivodeship in voivodeships" :value="voivodeship.idVoivodeship"> {{ voivodeship.name }} </option>
  </select>
  {{ selectedVoivodeship }}
</template>