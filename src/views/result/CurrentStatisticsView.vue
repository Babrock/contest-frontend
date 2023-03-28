<script>
export default {
  data() {
    return {
      voivodeships: [],
      tasks: [],
      sum: 0,
    }
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
      this.voivodeships = response.data
    })
    this.axios.get(`http://localhost:8080/tasks`).then((response) => {
      this.tasks = response.data
    })
  },
  methods: {
    kurwa(sum){

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
          <th v-for="task in tasks" :value="task.id">{{ task.name }}</th>
          <td></td>
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