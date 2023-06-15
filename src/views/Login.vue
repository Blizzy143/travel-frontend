<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const router = useRouter();
const isCreateAccount = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  id: ""
});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    savedUser.value = JSON.parse(localStorage.getItem("user"))
    if (savedUser.value.user_type === "admin") {
      router.push({ name: "admin" });
    } else {
      router.push({ name: "user" });
    }
  }
  else {
    router.push({ name: "login" });
  }
});

function navigateToDestinations() {
  router.push({ name: "destinations" });
}

async function createAccount() {
  await UserServices.addUser(user.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "blue";
      snackbar.value.text = "Account created successfully!";
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function login() {
  // add validation
  if (user.value.email === "" || user.value.password === "") {
    snackbar.value.value = true;
    snackbar.value.color = "red";
    snackbar.value.text = "Please enter email and password";
    return;
  }

  await UserServices.loginUser(user)
    .then((data) => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = data;
      console.log(data);
      window.localStorage.setItem("user", JSON.stringify(data.data));
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Login successful!";
      router.push({ name: "destinations" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "red";
      snackbar.value.text = error.response.data.message;
    });
}

function openCreateAccount() {
  isCreateAccount.value = true;
}

function closeCreateAccount() {
  isCreateAccount.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Login </v-card-title>
        <v-card-text>
          <v-text-field v-model="user.email" label="Email" required></v-text-field>

          <v-text-field v-model="user.password" label="Password" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="flat" color="secondary" @click="openCreateAccount()">Create Account</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="login()">Login</v-btn>
        </v-card-actions>
      </v-card>

      <v-card hidden class="rounded-lg elevation-5 my-8">
        <v-card-title class="text-center headline">
          <v-btn class="ml-2" variant="flat" color="secondary" @click="navigateToDestinations()">
            View Popular Iternaries
          </v-btn>
        </v-card-title>
      </v-card>

      <v-dialog persistent v-model="isCreateAccount" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Create Account </v-card-title>
          <v-card-text>
            <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>

            <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>

            <v-text-field v-model="user.email" label="Email" required></v-text-field>

            <v-text-field v-model="user.password" label="Password" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeCreateAccount()">Close</v-btn>
            <v-btn variant="flat" color="primary" @click="createAccount()">Create Account</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
