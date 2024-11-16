<template>
    <q-layout view="lHh Lpr lFf">
        <br>
        <div class="text-center q-mb-xl">
            <div class="text-h4 text-primary">Green City App</div>
        </div>
      <q-page-container class="flex flex-center full-height">
        
        <q-card style="width: 350px;">
            <q-card-section>
                <div class="text-h6">Inicio de sesión</div>
            </q-card-section>
          <q-card-section>
            <q-input
            v-model="email"
            label="Correo electrónico"
            type="email"
            outlined
            dense
            :rules="[val => !!val || 'El correo es obligatorio']"
          />
            <q-input
              v-model="password"
              label="Contraseña"
              :type="isPwd ? 'password' : 'text'"
              outlined
              dense
              hint="Password"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <q-btn
            label="Iniciar sesión"
            type="submit"
            color="primary"
            unelevated
            class="full-width q-mt-md"
          />
          <div class="text-center q-mt-md">
            <q-btn
              label="Registrarse"
              flat
              color="secondary"
              @click="goToRegister"
            />
          </div>
          </q-card-section>
        </q-card>
      </q-page-container>
    </q-layout>
  </template>
  
  <style></style>
  
  <script>
  export default {
    name: "LoginForm",
    data() {
      return {
        emailValue: "",
        pwdValue: "",
        isPwd: true,
      };
    },
    methods: {
      inicioSesion() {
        console.log("Click en el boton de inici de sesión");
        console.log("Valor del email: " + this.emailValue);
  
        let endpointLogin = "/api/User/SignIn";
        let user = { email: this.emailValue, password: this.pwdValue };
  
        this.$api
          .post(endpointLogin, user)
          .then((response) => {
            //respuesta exitosa
            //console.log("Respuesta exitosa: " + JSON.stringify(response));
            //Almacenamos la información en el LocalStorage
            localStorage.setItem("userData", JSON.stringify(response));
            this.$q.notify({
              message: "Bienvenido a Green City APP",
              color: "positive",
              position: "bottom",
              timeout: 5000,
            });
  
            this.$router.push("/dashboard");
          })
          .catch((error) => {
            //Ocurrió un error
            this.$q.notify({
              message: "Ocurrió un error",
              color: "negative",
              position: "top",
              timeout: 5000,
            });
            console.log("Error en: " + error);
          });
      },
    },
  };
  </script>