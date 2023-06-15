<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const savedUser = ref(null)

onMounted(async () => {

  if(localStorage.getItem("user") !== null) {
    savedUser.value = JSON.parse(localStorage.getItem("user"))
    if (savedUser.value.user_type === "admin") {
      router.push({ name: "admin" });
    } else {
      router.push({ name: "user" });
    }
  }else{
    router.push({ name: "login" });
  }
});

function navigateToDestinations() {
  router.push({ name: "destinations" });
}


function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      Admin dashboard
     
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
