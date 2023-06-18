<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import destinationService from "../services/DestinationService.js";
import PlaceService from "../services/PlaceService.js";
import HotelService from "../services/HotelService.js";
import tripsService from "../services/TripsService.js";


const route = useRoute();
const router = useRouter();



const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  getTrips();
});






const trips = ref([]);


// Get the trips for the destination

async function getTrips() {
  await tripsService
    .getTripsByUserId(user.value.id)
    .then((response) => {
      trips.value = response.data;
    })
    .catch((error) => {
      console.error("Error in fetching trips:", error);
    });
}

async function showDetails(plan) {
  router.push({ name: "plan-details", params: { planId: plan.trip_id, id: plan.Destination.destination_id } });
}


function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
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
          <v-col cols="12" sm="12">
            <v-row align="center" class="mb-4">
              <v-col cols="10"><v-card-title class="pl-0 text-h4">Trips registered
                </v-card-title>
              </v-col>
            </v-row>

            <v-table class="rounded-lg elevation-5">
              <thead>
                <tr>
                  <th class="text-left">Trip Description</th>
                  <th class="text-left">Start date</th>
                  <th class="text-left">End date</th>
                  <th class="text-left">Plan</th>

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
                </tr>
              </tbody>
            </v-table>
          </v-col>



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
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>