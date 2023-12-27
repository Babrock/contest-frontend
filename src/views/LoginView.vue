<script>
import { useAuthStore } from '@/store/auth.js'
export default {
  data() {
    return {
      authStore: useAuthStore(),
      username: "",
      password: "",
    }
  },
  methods: {
    login() {
      const formData = new FormData()
      formData.append("username", this.username)
      formData.append("password", this.password)
      this.axios.post("http://localhost:8080/login", formData).then(response => {
        this.authStore.isAuthenticated = true
        this.authStore.role = response.data
        this.axios.get('http://localhost:8080/tasks')
        this.$router.push('/')
      }).catch(err => {
        if (err.response.status === 401) {
          alert('Zły login lub hasło lub użytkownik nie został aktywowany.')
        }
      })
    }
  }
}
</script>

<template>
  <img alt="uniwer logo" class="photoLogin" src="@/assets/uniwerBetter.png"/>
  <div class="login">
    <p>Adres E-mail:<br><input v-model="username" type="email" id="email" name="email" placeholder="Podaj Email"><br>
    </p>
    <p>Hasło: <br><input v-model="password" type="password" id="haslo" name="haslo" placeholder="Podaj Hasło"><br></p>
    <button @click="login" class="buttonContinue" style="vertical-align:middle"><span>Przejdź dalej </span></button>
  </div>
</template>

<style>

.buttonContinue {
  background-color: #55d86d;
  border: none;
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
}

.buttonContinue:hover {
  background-color: #ADD8E6;
  border: none;
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
