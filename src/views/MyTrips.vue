<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import destinationService from "../services/DestinationService.js";
import PlaceService from "../services/PlaceService.js";
import HotelService from "../services/HotelService.js";
import tripsService from "../services/TripsService.js";


const route = useRoute();
const router = useRouter();


const dialog = ref(false);

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


// Unregister from a trip

async function unregister(trip) {
  await tripsService
    .removeUserFromTrip(trip.trip_id, user.value.id)
    .then((response) => {
     dialog.value = true;
      getTrips();
    })
    .catch((error) => {
      console.error("Error in unregistering from trip:", error);
      snackbar.value = {
        value: true,
        color: "error",
        text: "Error in unregistering from trip",
      };
    });
}


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
                  <th class="text-left">Action</th>

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
                    <v-chip @click="unregister(trip)" label append-icon="mdi-location-exit" color="red">Un-register
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>

          <v-fade-transition width="800" hide-on-leave>
            <v-card v-if="dialog" append-icon="$close" class="mx-auto" elevation="16" max-width="800"
              title="Trip status">
              <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="dialog = false"></v-btn>
              </template>

              <v-divider></v-divider>

              <div class="py-12 text-center">
                <v-icon class="mb-6" color="success" icon="mdi-check-circle-outline" size="128"></v-icon>

                <div class="text-h4 font-weight-bold">Un-registered to trip</div>
              </div>

              <v-divider></v-divider>

              <div class="pa-4 text-end">
                <v-btn class="text-none" color="medium-emphasis" min-width="92" rounded variant="outlined"
                  @click="dialog = false">
                  Close
                </v-btn>
              </div>
            </v-card>
          </v-fade-transition>


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