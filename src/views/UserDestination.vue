<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import destinationService from "../services/DestinationService.js";
import PlaceService from "../services/PlaceService.js";
import HotelService from "../services/HotelService.js";
import tripsService from "../services/TripsService.js";

const route = useRoute();

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
    .getTripsByDestinationId(user.value.id, route.params.id)
    .then((response) => {
      trips.value = response.data;
    })
    .catch((error) => {
      console.error("Error in fetching trips for destination");
    });
}

async function addTrip() {
  isAdd.value = false;
  delete newTrip.trip_id;
  await tripsService
    .createTrip(newTrip.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `trip to ${destination.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await fetchTrips();
}



async function updateTrip() {
  isEdit.value = false;
  await tripsService.updateTrip(newTrip.value.trip_id, newTrip.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Trip updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await fetchTrips();
}


async function deleteTrip(temp){
  await tripsService.deleteTrip(temp.trip_id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${temp.name} deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await fetchTrips();
}

function openAdd() {
  newTrip.value.name = undefined;
  newTrip.value.destination_id = destination.value.destination_id;
  newTrip.value.user_id = user.value.id;
  newTrip.value.start_date = undefined;
  newTrip.value.end_date = undefined;
  isAdd.value = true;
}

function openEdit(temp){
  console.log("temp", temp);
  isEdit.value = true;
  newTrip.value = temp;
}

function closeAdd() {
  isAdd.value = false;
}

function closeEdit() {
  isEdit.value = false;
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

async function showUpcoming(){
  snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Upcoming feature!";
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
              <v-img
                cover
                height="250"
                v-bind:src="destination.image"
              ></v-img>

              <v-card-item>
                <v-card-title>{{ destination.name }}</v-card-title>

                <v-card-subtitle>
                  <span class="me-1">Rating : {{ destination.rating }}</span>

                  <v-icon
                    color="green"
                    icon="mdi-fire-circle"
                    size="small"
                  ></v-icon>
                </v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <v-row align="center" class="mx-0">
                  <v-rating
                    :model-value="destination.rating"
                    color="amber"
                    density="compact"
                    half-increments
                    readonly
                    size="small"
                  ></v-rating>

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
              <v-col cols="10"
                ><v-card-title class="pl-0 text-h4"
                  >My trips to {{ destination.name }}
                </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn v-if="user !== null" color="accent" @click="openAdd()"
                  >Add</v-btn
                >
              </v-col>
            </v-row>

            <v-table class="rounded-lg elevation-5">
              <thead>
                <tr>
                  <th class="text-left">Trip Description</th>
                  <th class="text-left">Start date</th>
                  <th class="text-left">End date</th>
                  <th class="text-left">Edit</th>
                  <th class="text-left">Delete</th>
                  <th class="text-left">Plan</th>

                </tr>
              </thead>
              <tbody>
                <tr v-for="trip in trips" :key="trip.name">
                  <td>{{ trip.name }}</td>
                  <td>{{ formatDate(trip.start_date) }}</td>
                  <td>{{ formatDate(trip.end_date) }}</td>
                  <td>
                    <v-icon
                      size="small"
                      icon="mdi-pencil"
                      @click="openEdit(trip)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-icon
                      size="small"
                      icon="mdi-delete"
                      @click="deleteTrip(trip)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-chip @click="showUpcoming()" label append-icon="mdi-plus" color="green">
Plan it
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>

          <v-dialog persistent :model-value="isAdd || isEdit" width="800">
            <v-card class="rounded-lg elevation-5">
              <v-card-item>
                <v-card-title class="headline mb-2"
                  >{{ isAdd ? "Add Trip" : isEdit ? "Edit trip" : "" }}
                </v-card-title>
              </v-card-item>
              <v-card-text>
                <v-text-field
                  v-model="newTrip.name"
                  label="Name"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="newTrip.start_date"
                  label="Start date"
                  type="date"
                ></v-text-field>
                <v-text-field
                  v-model="newTrip.end_date"
                  label="End date"
                  type="date"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  variant="flat"
                  color="secondary"
                  @click="isAdd ? closeAdd() : isEdit ? closeEdit() : false"
                  >Close</v-btn
                >
                <v-btn
                  variant="flat"
                  color="primary"
                  @click="isAdd ? addTrip() : isEdit ? updateTrip() : false"
                  >{{
                    isAdd ? "Add Trip " : isEdit ? "Update Trip" : ""
                  }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        
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