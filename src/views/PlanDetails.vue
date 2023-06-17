<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import destinationService from "../services/DestinationService.js";
import tripsService from "../services/TripsService.js";
import ItenarySerice from "../services/ItenaryService.js";

const route = useRoute();
const destination = ref({});
const isAdd = ref(false);
const isEdit = ref(false);
const places = ref([]);
const hotels = ref([]);

const itinary = ref({
  date: "",
  trip_id: route.params.planId
});

const user = ref(null);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  fetchDestination();
  fetchTrip();
});


async function fetchDestination() {
  // Use the destination service to fetch the destination
  await destinationService
    .getDestinationById(route.params.id)
    .then((response) => {
      destination.value = response.data;
      places.value = response.data.Places;
      hotels.value = response.data.Hotels;
    })
    .catch((error) => {
      console.error("Error in fetching destination:", error);
    });
}

async function addItenary() {
  await tripsService
    .addItenary(itinary.value)
    .then((response) => {
      console.log("response", response);
      snackbar.value.color = "success";
      snackbar.value.text = "Itenary added successfully";
      snackbar.value.value = true;
      closeAdd();
      fetchTrip();
    })
    .catch((error) => {
      console.error("Error in adding itenary:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in adding itenary";
      snackbar.value.value = true;

    });
}
const trip = ref(null);

async function fetchTrip() {
  await tripsService
    .getTripById(route.params.planId)
    .then((response) => {
      trip.value = response.data;
    })
    .catch((error) => {
      console.error("Error in fetching trips:", error);
    });
}

const updatePlace = ref(false);
const updateHotel = ref(false);
const selectedIterary = ref(null);

async function selectPlace(item) {
  selectedIterary.value = item;
  updatePlace.value = true;
}

async function selectHotel(item) {
  selectedIterary.value = item;
  updateHotel.value = true;
}

async function addPlaceToTrip(place) {

  ItenarySerice.addPlaceToItinary(selectedIterary.value.itinerary_id, place.id)
    .then((response) => {
      console.log("response", response);
      snackbar.value.color = "success";
      snackbar.value.text = "Place added successfully";
      snackbar.value.value = true;
      updatePlace.value = false;
      fetchTrip();
    })
    .catch((error) => {
      console.error("Error in adding place:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in adding place";
      snackbar.value.value = true;

    });
  
}

async function  updateHotelCall(hotel){
  selectedIterary.value.hotel_id = hotel.id;
  // delete selectedIterary.value.Hotel;
  if (selectedIterary.value.Place === null || selectedIterary.value.Place === undefined) {
    // delete selectedIterary.value.Place;
    selectedIterary.value.place_id = null;
  } else {
    var place = selectedIterary.value.Place;
    // delete selectedIterary.value.Place;
    selectedIterary.value.place_id = place.id;
  }
  updatePlace.value = false;
      updateHotel.value = false;
  await updateIternary();
}

async function updateIternary() {

  await ItenarySerice.updateItenerarie(selectedIterary.value)
    .then((response) => {
      console.log("response", response);
      snackbar.value.color = "success";
      snackbar.value.text = "Itenary updated successfully";
      snackbar.value.value = true;
      fetchTrip();
    })
    .catch((error) => {
      console.error("Error in updating itenary:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in updating itenary";
      snackbar.value.value = true;

    });
}

function openAdd() {
  isAdd.value = true;
}


function closeAdd() {
  isAdd.value = false;
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
              <v-col cols="10"><v-card-title v-if="trip" class="pl-0 text-h4">Itenaries fo the trip {{ trip.name }}
                </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" v-if="user !== null && user.user_type === 'admin'" @click="openAdd()">Add</v-btn>
              </v-col>
            </v-row>

            <v-table class="rounded-lg elevation-5">
              <thead>
                <tr>
                  <th class="text-left">Day</th>
                  <th class="text-left">Date</th>
                  <th class="text-left">Place</th>
                  <th class="text-left">Hotel</th>
                </tr>
              </thead>
              <tbody v-if="trip">
                <tr v-for="temp in trip.Itineraries" :key="temp.data">
                  <td>Day {{ trip.Itineraries.indexOf(temp) + 1 }}</td>
                  <td>{{ formatDate(temp.date) }}</td>
                  <td>

                    <v-chip v-if="temp.Places.length > 0 " @click="selectPlace(temp)"  class="mr-1" label color="cyan" prepend-icon="mdi-barley">
                      {{ temp.Places.map(function(place){
                        return place.name;
                      }).join(', ') 
                      }}
                    </v-chip>
                    <v-chip v-if="user !== null && user.user_type === 'admin'" @click="selectPlace(temp)" label  color="green" prepend-icon="mdi-plus">
                      Add
                    </v-chip>
                  </td>
                  <td> 
                    <v-chip v-if="temp.Hotel === null" label @click="selectHotel(temp)" color="cyan" prepend-icon="mdi-bed">
                      Select hotel
                    </v-chip>
                  
                    <v-chip v-else label @click="selectHotel(temp)" color="cyan" prepend-icon="mdi-bed">
                      {{ temp.Hotel.name }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>

          <v-dialog :model-value="isAdd" width="800">
            <v-card class="rounded-lg elevation-5">
              <v-card-item>
                <v-card-title class="headline mb-2"> Add itinary for the trip
                </v-card-title>
              </v-card-item>
              <v-card-text>
                <v-text-field v-model="itinary.date" label="Date" type="date"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="secondary" @click="closeAdd()">Close</v-btn>
                <v-btn variant="flat" color="primary" @click="addItenary()">Add iteinary</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>



          <v-dialog persistent :model-value="updatePlace" width="800">
            <v-card class="rounded-lg elevation-5">
              <v-card-item>
                <v-card-title class="headline mb-2">Select place to add to iternary
                </v-card-title>
              </v-card-item>
              <v-card-text>
                <v-table class="rounded-lg elevation-5">
                  <thead>
                    <tr>
                      <th class="text-left">Place name</th>
                      <th class="text-left">description </th>
                      <th class="text-left">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr @click="addPlaceToTrip(place)" v-for="place in places" :key="place.name">
                      <td>{{ place.name }}</td>
                      <td>{{ place.description }}</td>
                      <td>{{ place.address }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="secondary" @click="updatePlace = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog persistent :model-value="updateHotel" width="800">
            <v-card class="rounded-lg elevation-5">
              <v-card-item>
                <v-card-title class="headline mb-2">Select hotel to add to iternary
                </v-card-title>
              </v-card-item>
              <v-card-text>
                <v-table class="rounded-lg elevation-5">
                  <thead>
                    <tr>
                      <th class="text-left">Hotel name</th>
                      <th class="text-left">Address </th>
                      <th class="text-left">Website</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr @click="updateHotelCall(hotel)" v-for="hotel in hotels" :key="hotel.name">
                      <td>{{ hotel.name }}</td>
                      <td>{{ hotel.description }}</td>
                      <td>{{ hotel.address }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="secondary" @click="updateHotel = false">Close</v-btn>
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
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>