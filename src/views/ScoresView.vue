 <script>
 export default {
   data: () => ({
     schools: [],
     schoolClasses: [],
     schoolClass: "",
     school: 0,
     tasks:[],
     taskswithsumscore: [],
     itemsPerPage: 15,
     dialog: false,
     dialogDelete: false,
     dialogEditSumScore: false,
     headersSumScore: [
       {
         title: 'Kategoria',
         align: 'start',
         sortable: false,
         key: 'schoolClass.form.schoolDetails.category.name',
       },
       { title: 'Klasa', key: 'schoolClass.name' },
       { title: 'Typ szkoły', key: 'schoolClass.form.schoolDetails.schoolType.name' },
       { title: 'Szkoła', key: 'schoolClass.school.name' },
 
       { title: 'Region', key: 'schoolClass.form.schoolDetails.region.name' },
       { title: 'Województwo', key: 'schoolClass.form.school.city.community.county.voivodeship.name' },
       { title: 'Powiat', key: 'schoolClass.form.school.city.community.county.name' },
       { title: 'Gmina', key: 'schoolClass.form.school.city.community.name' },
       { title: 'Miasto', key: 'schoolClass.form.school.city.name' },
       
       { title: 'Wyniki', key: 'score' },
       { title: 'Nauczyciel', key: 'schoolClass.teacher' },
       { title: 'Liczba uczniów', key: 'schoolClass.students' },
     ],
     headers: [
       {
         title: 'Nazwa zadania',
         align: 'start',
         sortable: true,
         key: 'schoolClass.form.schoolDetails.category.name',
       },
       { title: 'Nazwa zadania', key: 'name' },
 
       { title: 'Nazwa szkoły', key: 'schoolClass.school.name' },
       { title: 'Punkty', key: 'score' },
       { title: 'Nauczyciel', key: 'schoolClass.teacher' },
       { title: 'Klasa', key: 'schoolClass.name' },
       { title: 'Liczba uczniów', key: 'schoolClass.students' },
       // { title: 'Opcje', key: 'actions', sortable: false },
     ],
     editedIndex: -1,
     editedItemId:null,
     editedItem: {
       schoolId: null,
       schoolClass: "",
       name: 0,
       score: 0,
     },
     defaultItem: {
       schoolId: null,
       schoolClass: "",
       name: 0,
       score: 0,
     },
 
   }),
   beforeMount() {
     this.axios.get(`http://localhost:8080/voivodeships`).then((response) => {
       this.voivodeships = response.data
     })
     this.axios.get(`http://localhost:8080/classes`).then((response) => {
       this.schools = response.data
     })
     this.axios.get(`http://localhost:8080/tasks/sum-score`).then((response) => {
       this.taskswithsumscore = response.data
       console.log(response.data)
     })
     // this.axios.get(`http://localhost:8080/tasks`).then((response) => {
     //   this.tasks = response.data
     // })
   },
   computed: {
     formTitleSumScore() {
       return this.editedIndex === -1 ? 'Nowy wynik' : 'Edycja wyniku'
     },
     formTitle() {
       return this.editedIndex === -1 ? 'Nowe zadanie' : 'Edycja zadania'
     },
   },
   watch: {
     dialog(val) {
       val || this.close()
     },
     dialogDelete(val) {
       val || this.closeDelete()
     },
     "editedItem.schoolId"(SchoolId) {
       if (SchoolId !== null &&  SchoolId !==  undefined){
         this.axios.get(`http://localhost:8080/classes/${SchoolId}`).then((response) => {
           this.schoolClasses = response.data
         })  
       }
     },
   },
   methods: {
     async fetchData() {
       const responseSumScore = await this.axios.get(`http://localhost:8080/tasks/sum-score`);
       this.taskswithsumscore = responseSumScore.data;
       const response = await this.axios.get(`http://localhost:8080/tasks`);
       this.tasks = response.data;
     },
     editItem(item) {
       this.axios.get(`http://localhost:8080/tasks/${item.schoolClass.id}`).then((response) => {
         this.tasks = response.data
         console.log(response.data)
       })
       this.dialogEditSumScore = true
     },
     editScore(item) {
       console.log(this.tasks)
       this.editedIndex = this.tasks.indexOf(item)
       this.editedItemId = item.id
       this.editedItem.schoolId = item.schoolId;
       this.editedItem.schoolClass = item.schoolClass.id;
       this.editedItem.name = item.name;
       this.editedItem.score = item.score;
       this.dialog = true
     },
     deleteItem(item) {
       this.editedIndex = this.taskswithsumscore.indexOf(item)
       this.editedItem = Object.assign({}, this.taskswithsumscore[this.editedIndex])
       this.dialogDelete = true
     },
     deleteItemConfirm() {
       this.taskswithsumscore.splice(this.editedIndex, 1)
       this.axios.delete(`http://localhost:8080/tasks/${this.editedItem.schoolClass.id}`)
       this.closeDelete()
     },
     close() {
       this.dialog = false
       this.$nextTick(() => {
         this.editedItem = Object.assign({}, this.defaultItem)
         this.editedIndex = -1
       })
     },
     closeDelete() {
       this.dialogDelete = false
       this.$nextTick(() => {
         this.editedItem = Object.assign({}, this.defaultItem)
         this.editedIndex = -1
       })
     },
     async save() {
       function validateValue(value, minValue, maxValue, errorMessage) {
           if (parseInt(value) > maxValue) {
               alert(errorMessage);
               return maxValue;
           }
           if (parseInt(value) < minValue) {
               alert(errorMessage);
               return minValue;
           }
           return parseInt(value);
       }
       this.editedItem.name = validateValue(this.editedItem.name, 0, 20, "Numer zadanie nie może być większy niż 20 lub mniejszy niż 0.");
       this.editedItem.score = validateValue(this.editedItem.score, 0, 100, "Liczba punktów nie może być większa niż 100 lub mniejsza niż 0.");
       try {
       if (this.editedIndex > -1) {
         console.log(this.editedItem)
           await this.axios.put(`http://localhost:8080/tasks/${this.editedItemId}`, this.editedItem)
         } else {
           await this.axios.post('http://localhost:8080/tasks/add', this.editedItem)
         }
       this.close()
       await this.fetchData()
       } catch (error) {
         if (error.response && error.response.status === 500) {
           alert("Zadanie o takiej nazwie już istnieje.");
         } else {
           alert("Wystąpił błąd podczas komunikacji z serwerem.");
         }
       }
     },
     
   },
 }
 </script>
 
 <template>
   <v-data-table v-model:items-per-page="itemsPerPage" :headers="headersSumScore" :items="taskswithsumscore" item-value="name"
     :sort-by="[{ key: 'score', order: 'asc' }]" class="h-100 elevation-1"  multi-sort>
 
     <template v-slot:top>
       <v-toolbar flat>
         <v-toolbar-title>Wyniki</v-toolbar-title>
         <v-divider class="mx-4" inset vertical></v-divider>
         <v-spacer></v-spacer>
         <v-dialog v-model="dialog" max-width="80%">
           <template v-slot:activator="{ props }">
             <!-- <v-btn color="primary" dark class="mb-2" v-bind="props">
               Nowy wynik
             </v-btn> -->
           </template>
           <v-card>
             <v-card-title>
               <span class="text-h5">{{ formTitleSumScore }}</span>
             </v-card-title>
             {{ this.editedItem }}
 
             <v-card-text>
               <v-container>
                 <v-row>
                   <v-col cols="12" md="6">
                     <v-select 
                       label="Wybierz szkołe" 
                       v-model="editedItem.schoolId" 
                       :items="schools" 
                       item-value="school.id"
                       item-title="school.name"
                     ></v-select>
                   </v-col>
                   <v-col cols="12" md="2">
                     <v-select 
                       label="Wybierz klasę" 
                       v-model="editedItem.schoolClass" 
                       :items="schoolClasses" 
                       item-value="id"
                       item-title="name" 
                       no-data-text="Nie wybrano szkoły"
                       ></v-select>
                   </v-col>
                   <v-col cols="12" md="2">
                     <v-text-field 
                       v-model="editedItem.name" 
                       type="number" 
                       min="0" 
                       max="20" 
                       label="Wpisz numer zadania"
                       ></v-text-field>
                   </v-col>
                   <v-col cols="12" md="2">
                     <v-text-field 
                       v-model="editedItem.score" 
                       type="number"  
                       min="0" 
                       max="100" 
                       step="0.5" 
                       label="Wpisz liczbę punktów"
                     ></v-text-field>
                   </v-col>
                 </v-row>
               </v-container>
             </v-card-text>
 
             <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="blue-darken-1" variant="text" @click="close">
                 Anuluj
               </v-btn>
               <v-btn color="blue-darken-1" variant="text" @click="save">
                 Zapisz
               </v-btn>
             </v-card-actions>
           </v-card>
         </v-dialog>
         <v-dialog v-model="dialogDelete" max-width="500px">
           <v-card>
             <v-card-title class="text-h5">Czy na pewno chcesz usunąć ten wynik?</v-card-title>
 
             <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Nie</v-btn>
               <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Tak</v-btn>
               <v-spacer></v-spacer>
             </v-card-actions>
           </v-card>
 
         </v-dialog>
       </v-toolbar>
     <!-- </template>
     <template v-slot:item.actions="{ item }">
       <v-icon size="small" class="me-2" @click="editItem(item.raw)">
         mdi-pencil
       </v-icon>
       <v-icon size="small" @click="deleteItem(item.raw)">
         mdi-delete
       </v-icon>
     </template>
     <template v-slot:no-data> -->
     </template>
   </v-data-table>
 
 
 
 
 
 
 
 
 
 
 
 
 
   <v-dialog v-model="dialogEditSumScore" max-width="80%">
     <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="tasks" item-value="name"
     :sort-by="[{ key: 'score', order: 'asc' }]" class="elevation-1">
 
     <template v-slot:top>
       <v-toolbar flat>
         <v-toolbar-title>Wyniki</v-toolbar-title>
         <v-divider class="mx-4" inset vertical></v-divider>
         <v-spacer></v-spacer>
         <v-dialog v-model="dialog" max-width="80%">
           <template v-slot:activator="{ props }">
             <v-btn color="primary" dark class="mb-2" v-bind="props">
               Nowe zadanie
             </v-btn>
           </template>
           <v-card>
             <v-card-title>
               <span class="text-h5">{{ formTitle }}</span>
             </v-card-title>
             {{ this.editedItem }}
 
             <v-card-text>
               <v-container>
                 <v-row>
                   <v-col cols="12" md="6">
                     <v-select 
                       label="Wybierz szkołe" 
                       v-model="editedItem.schoolId" 
                       :items="schools" 
                       item-value="school.id"
                       item-title="school.name"
                     ></v-select>
                   </v-col>
                   <v-col cols="12" md="2">
                     <v-select 
                       label="Wybierz klasę" 
                       v-model="editedItem.schoolClass" 
                       :items="schoolClasses" 
                       item-value="id"
                       item-title="name" 
                       no-data-text="Nie wybrano szkoły"
                       ></v-select>
                   </v-col>
                   <v-col cols="12" md="2">
                     <v-text-field 
                       v-model="editedItem.name" 
                       type="number" 
                       min="0" 
                       max="20" 
                       label="Wpisz numer zadania"
                       ></v-text-field>
                   </v-col>
                   <v-col cols="12" md="2">
                     <v-text-field 
                       v-model="editedItem.score" 
                       type="number"  
                       min="0" 
                       max="100" 
                       step="0.5" 
                       label="Wpisz liczbę punktów"
                     ></v-text-field>
                   </v-col>
                 </v-row>
               </v-container>
             </v-card-text>
 
             <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="blue-darken-1" variant="text" @click="close">
                 Anuluj
               </v-btn>
               <v-btn color="blue-darken-1" variant="text" @click="save">
                 Zapisz
               </v-btn>
             </v-card-actions>
           </v-card>
         </v-dialog>
         <v-dialog v-model="dialogDelete" max-width="500px">
           <v-card>
             <v-card-title class="text-h5">Czy na pewno chcesz usunąć ten wynik?</v-card-title>
 
             <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Nie</v-btn>
               <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Tak</v-btn>
               <v-spacer></v-spacer>
             </v-card-actions>
           </v-card>
 
         </v-dialog>
       </v-toolbar>
     </template>
     <template v-slot:item.actions="{ item }">
       <v-icon size="small" class="me-2" @click="editScore(item.raw)">
         mdi-pencil
       </v-icon>
       <v-icon size="small" @click="deleteItem(item.raw)">
         mdi-delete
       </v-icon>
     </template>
     <template v-slot:no-data>
     </template>
   </v-data-table>
  </v-dialog>
 
 
  
 
 </template>
 
 <style>
 
 </style>