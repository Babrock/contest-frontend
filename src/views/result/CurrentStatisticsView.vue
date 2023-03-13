<script>
export default {
  data() {
    return {
      voivodeships: [],
      scores: [],
      sum: 0,
    }
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
      this.voivodeships = response.data
    })
    this.axios.get(`http://localhost:8080/scores`).then((response) => {
      this.scores = response.data
    })
  },
  methods: {
    kurwa(sum){
      return sum = this.scores.task1 + this.scores.task2
    },
  }
}
</script>

<template>
    <table>
        <tr class="trHead">
          <th>województwo</th>
          <th>Wynik</th>
          <th>idk</th>
        </tr>
        <tr v-for="voivodeship in voivodeships"> {{ voivodeship.name }} 
          <th></th>
          <td  v-for="score in scores" :value="score.id"> {{ score.task1 }} , {{ score.task2 }}</td>
          <td></td>
        </tr>
    </table>
</template>

<style>
table {
  background-color:black;
}
.trHead {
  background-color: grey;
}
tr {
  background-color: lightgray;
  text-align: center;
  /* vertical-align: middle; */
}

</style>