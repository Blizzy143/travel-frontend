<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import RecipeCard from "../components/DestinationCard.vue";
import destinationService from "../services/DestinationService.js";

const router = useRouter();


const destinations = ref([]);
const isAdd = ref(false);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const newDestination = ref({
  name: "",
  description: "",
  image: "",
  rating: 0,
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

async function addDestination() {
  isAdd.value = false;
  // newDestination.value.userId = user.value.id;
  await destinationService
    .createDestination(newDestination.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newDestination.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error;
    });
  await fetchDestinations();
}

function openAdd() {
  isAdd.value = true;
}
function closeAdd() {
  isAdd.value = false;
}
const user = ref(null)

onMounted(async () => {

  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"))
    if (user.value.user_type === "admin") {
      fetchDestinations();
    } else {
      router.push({ name: "user" });
    }
  } else {
    router.push({ name: "login" });
  }
});

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">Destinations
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()">Add</v-btn>
        </v-col>
      </v-row>

      <RecipeCard v-for="destination in destinations" :key="destination.destination_id" :destination="destination" />

      <v-dialog persistent v-model="isAdd" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add Destination </v-card-title>
          <v-card-text>
            <v-text-field v-model="newDestination.name" label="Name" required></v-text-field>

            <v-text-field v-model.number="newDestination.description" label="Description"></v-text-field>
            <v-text-field v-model.number="newDestination.image" label="Image"></v-text-field>
            <v-text-field v-model.number="newDestination.rating" label="Rating" type="number"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAdd()">Close</v-btn>
            <v-btn variant="flat" color="primary" @click="addDestination()">Add Destination</v-btn>
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
