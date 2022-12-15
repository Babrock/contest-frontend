<template>
  <img alt="uniwer logo" class="photoLogin" src="@/assets/uniwerBetter.png" width="125" height="125" />
  <div class="login">
    <form action="" method="POST">
      <p>Login: <br><input type="text" id="login" name="login" placeholder="Podaj Login"><br> </p>
      <p>Hasło: <br><input type="password" id="haslo" name="haslo" placeholder="Podaj Hasło"><br> </p>
      <p>Adres E-mail:<br><input type="email" id="email" name="email" placeholder="Podaj Email"><br></p>
      <button class="buttonContinue" style="vertical-align:middle"><span>Przejdź dalej </span></button>
    </form>

  </div>
</template>

<style>
.photoLogin{
  width: 50%;
  height: auto;
  margin: 10%;
  margin-top: 5.5%;
  margin-left: 40%;
}

.login {
  position: absolute;
  margin-top: 30%;
  margin-left: 5%;
  float: left;
  padding: 5%;
  box-shadow: 0 0 100px 40px rgba(0, 0, 0, 0.2);

  padding: 2%;
  font-weight: bold;
  text-shadow: 1px 0px 10px #000000;
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
