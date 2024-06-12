<template>
  <div id="excel-like-table" >
    <table>
      <thead>
      <tr>
        <th></th> <!-- Puste pole w lewym górnym rogu -->
        <th v-for="(col, colIndex) in columns" :key="colIndex" contenteditable="true">
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
        <td>{{ rowIndex + 1 }}</td> <!-- Numeracja w pierwszej kolumnie -->
        <td v-for="(col, colIndex) in columns" :key="colIndex" contenteditable="true">
          {{ cells[rowIndex][colIndex] }} <!-- Edytowalne komórki -->
        </td>
      </tr>
      </tbody>
    </table>
    <v-btn @click="addRow">Dodaj wiersz</v-btn>
    <v-btn @click="addColumn">Dodaj kolumnę</v-btn>
    <v-btn @click="removeRow">Usuń wiersz</v-btn>
    <v-btn @click="removeColumn">Usuń kolumnę</v-btn>
    <v-btn @click="printTable">Drukuj</v-btn>
  </div>
</template>

<script>
import NavigationBar from "@/App.vue";
export default {
  components: {NavigationBar},
  data() {
    return {
      rows: 20, // Początkowa liczba wierszy
      columns: 5, // Początkowa liczba kolumn
      cells: Array.from({ length: 20 }, () => Array(5).fill('')) // Tablica z pustymi komórkami
    };
  },
  methods: {
    addRow() {
      this.rows++;
      this.cells.push(Array(this.columns).fill(''));
    },
    addColumn() {
      this.columns++;
      this.cells.forEach(row => row.push(''));
    },
    removeRow() {
      if (this.rows > 1) {
        this.rows--;
        this.cells.forEach(col => col.pop());
      }
    },
    removeColumn() {
      if (this.columns > 1) {
        this.columns--;
        this.cells.forEach(row => row.pop());
      }
    },
    printTable() {
      window.print();
    }
  }
};
</script>

<style scoped>
#excel-like-table {
  margin: 20px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid black;
  text-align: center;
  padding: 10px;
  color: black;
}
@media print{
  .main,
  .header,
  div.v-toolbar,
  div.v-toolbar__content,
  .v-toolbar,
  v-toolbar__content,
  .v-navigation-drawer,
  .v-app-bar,
  .v-btn,
  .v-field__append-inner,
  .v-input__details,
  .NavigationBar{
    display: none !important;
  }

  .main,
  .header,
  div.v-toolbar,
  div.v-toolbar__content,
  .v-toolbar,
  v-toolbar__content,
  .v-navigation-drawer,
  .v-app-bar,
  .v-btn,
  .v-field__append-inner,
  .v-input__details,
  .NavigationBar{
    visibility: hidden !important;
  }

}
</style>
