<template>
  <div class="containerL">
    <img alt="uniwer logo" class="photoLogin" src="@/assets/uniwerBetter.png" width="125" height="125" />
    <div class="login">
      <p>Adres E-mail:<br><input v-model="username" type="email" id="email" name="email" placeholder="Podaj Email"><br>
      </p>
      <p>Hasło: <br><input v-model="password" type="password" id="haslo" name="haslo" placeholder="Podaj Hasło"><br>
      </p>
      <button @click="login" class="buttonContinue" style="vertical-align:middle"><span>Przejdź dalej </span></button>
    </div>
  </div>
</template>

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
        this.$router.push('/')
      }).catch(err => {
        if (err.response.status === 401) {
          alert('bledny login lub haslo')
        }
      })
    }
  }
}
</script>

<style>
.containerL {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;

  margin: auto;
  margin-top: 5%;
  padding: 3%;
  box-shadow: 0 0 100px 40px rgba(0, 0, 0, 0.2);
}

.login {
  margin-top: 10%;
  margin-left: 5%;
}

.photoLogin {
  width: 80%;
  height: auto;
}

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
  padding: 12px 32px;
  text-decoration: none;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 10px;
}


.buttonContinue span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.buttonContinue span:after {
  content: '\00bb';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

.buttonContinue:hover span {
  padding-right: 30px;
}

.buttonContinue:hover span:after {
  opacity: 1;
  right: 0;
}
</style>
