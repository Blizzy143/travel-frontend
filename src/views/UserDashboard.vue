<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import DestinationCard from "../components/DestinationCard.vue";
import destinationService from "../services/DestinationService.js";
const router = useRouter();


const user = ref(null)

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const destinations = ref([]);

onMounted(async () => {
  if(localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"))
    if (user.value.user_type === "admin") {
      router.push({ name: "admin" });
    } else {
      await fetchDestinations();
    }
  }else{
    router.push({ name: "login" });
  }
});


async function fetchDestinations() {
  // Use the destination service to fetch all destinations
  await destinationService
    .getAllDestinations()
    .then((response) => {
      destinations.value = response.data;
    })
    .catch((error) => {
      console.error("Error in fetching destinations:", error);
    });
}



function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
     

      <v-row align="center" class="mb-4">
        <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">Available Destinations
          </v-card-title>
        </v-col>
      </v-row>

      <DestinationCard v-for="destination in destinations" :key="destination.destination_id" :destination="destination" />



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
