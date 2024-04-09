<script>
import {useAuthStore} from '@/store/auth.js'

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
  <div class="d-flex flex-column justify-center" style="width: 20rem">
    <div class="d-flex">
      <v-text-field
          v-model="username"
          label="Login"
          required
      />
    </div>
    <div class="d-flex">
      <v-text-field
          v-model="password"
          type="password"
          label="Hasło"
          required
      />
    </div>
    <div class="d-flex">
      <v-btn class="w-100" color="success" @click="login">Zaloguj</v-btn>
    </div>
  </div>
</template>

<style>
</style>
