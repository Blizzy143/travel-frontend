<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import destinationService from "../services/DestinationService.js";
import PlaceService from "../services/PlaceService.js";
import HotelService from "../services/HotelService.js";
import tripsService from "../services/TripsService.js";

const route = useRoute();

const router = useRouter();

const destination = ref({});
const trips = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);


const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const newTrip = ref({
  name: "",
  destination_id: route.params.id,
  user_id: "",
  start_date: "",
  end_date: "",
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  newTrip.value.user_id = user.value.id;
  console.log("trip", newTrip.value);
  fetchDestination();
});


async function fetchDestination() {
  // Use the destination service to fetch the destination
  await destinationService
    .getDestinationById(route.params.id)
    .then((response) => {
      destination.value = response.data;
      fetchTrips();
    })
    .catch((error) => {
      console.error("Error in fetching destination:", error);
    });
}

async function fetchTrips() {
  console.log("fetching trips");
  await tripsService
    .getTripsByDestination(route.params.id)
    .then((response) => {
      trips.value = response.data;
    })
    .catch((error) => {
      console.error("Error in fetching trips for destination");
    });
}

async function register(trip) {
  console.log("registering to trip", trip);
  await tripsService
    .addUserToTrip(trip.trip_id, user.value.id)
    .then((response) => {
      console.log("response", response);
      snackbar.value = {
        value: true,
        color: "success",
        text: "Successfully registered to trip",
      };
      fetchTrips();
    })
    .catch((error) => {
      console.error("Error in registering to trip", error);
      snackbar.value = {
        value: true,
        color: "error",
        text: "Error in registering to trip",
      };
    });
}



function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

async function showDetails(plan) {
  router.push({ name: "plan-details", params: { planId: plan.trip_id, id: destination.value.destination_id } });
}


function closeSnackBar() {
  snackbar.value.value = false;
}

</script>

<template>
  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12" sm="4">
            <v-card class="mx-auto mb-12" max-width="374">
              <v-img cover height="250" v-bind:src="destination.image"></v-img>

              <v-card-item>
                <v-card-title>{{ destination.name }}</v-card-title>

                <v-card-subtitle>
                  <span class="me-1">Rating : {{ destination.rating }}</span>

                  <v-icon color="green" icon="mdi-fire-circle" size="small"></v-icon>
                </v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <v-row align="center" class="mx-0">
                  <v-rating :model-value="destination.rating" color="amber" density="compact" half-increments readonly
                    size="small"></v-rating>

                  <div class="text-grey ms-4">
                    {{ destination.rating }}
                  </div>
                </v-row>
                <div class="my-4">{{ destination.description }}</div>
              </v-card-text>

              <v-divider class="mx-4 mb-1"></v-divider>
            </v-card>
          </v-col>


          <v-col cols="12" sm="8">
            <v-row align="center" class="mb-4">
              <v-col cols="10"><v-card-title class="pl-0 text-h4">Trips available in {{ destination.name }}
                </v-card-title>
              </v-col>
            </v-row>

            <v-table class="rounded-lg elevation-5">
              <thead>
                <tr>
                  <th class="text-left">Trip Description</th>
                  <th class="text-left">Start date</th>
                  <th class="text-left">End date</th>
                  <th class="text-left">Details</th>
                  <th class="text-center">Register</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trip in trips" :key="trip.name">
                  <td>{{ trip.name }}</td>
                  <td>{{ formatDate(trip.start_date) }}</td>
                  <td>{{ formatDate(trip.end_date) }}</td>
                  <td>
                    <v-chip @click="showDetails(trip)" label append-icon="mdi-airplane" color="cyan">Details
                    </v-chip>
                  </td>
                  <td>
                    <v-chip @click="register(trip)" label append-icon="mdi-plus" color="green">Register to {{ destination.name }} trip
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>

         

          <v-snackbar v-model="snackbar.value" rounded="pill">
            {{ snackbar.text }}

            <template v-slot:actions>
              <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>