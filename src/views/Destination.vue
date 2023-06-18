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
const isAdd = ref(false);
const isEdit = ref(false);

const isAddHotel = ref(false);
const isEditHotel = ref(false);

const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const place = ref({
  name: "",
  address: "",
  description: "",
  destination_id: route.params.id,
});

const hotel = ref({
  name: "",
  address: "",
  website: "",
  destination_id: route.params.id,
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  fetchDestination();
  getTrips();
});


async function fetchDestination() {
  // Use the destination service to fetch the destination
  await destinationService
    .getDestinationById(route.params.id)
    .then((response) => {
      destination.value = response.data;
    })
    .catch((error) => {
      console.error("Error in fetching destination:", error);
    });
}

async function addPlace() {
  // Use the place service to add a place
  await PlaceService.createPlace(place.value)
    .then((response) => {
      fetchDestination();
      closeAdd();
      snackbar.value.color = "success";
      snackbar.value.text = "Place added successfully";
      snackbar.value.value = true;

    })
    .catch((error) => {
      console.error("Error in adding place:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in adding place";
      snackbar.value.value = true;
    });
}

async function updatePlace(){
  // Use the place service to update a place
  await PlaceService.updatePlace(place.value)
    .then((response) => {
      fetchDestination();
      closeEdit();
      snackbar.value.color = "success";
      snackbar.value.text = "Place updated successfully";
      snackbar.value.value = true;

    })
    .catch((error) => {
      console.error("Error in updating place:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in updating place";
      snackbar.value.value = true;

    });
}

async function deletePlace(selectedPlace){
  // Use the place service to delete a place
  await PlaceService.deletePlace(selectedPlace.id)
    .then((response) => {
      fetchDestination();
      closeEdit();
      snackbar.value.color = "success";
      snackbar.value.text = "Place deleted successfully";
      snackbar.value.value = true;

    })
    .catch((error) => {
      console.error("Error in deleting place:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in deleting place";
      snackbar.value.value = true;

    });
}

function openAdd() {
  isAdd.value = true;
  place.value = {
    name: "",
    address: "",
    description: "",
    destination_id: route.params.id,
  };
}

function openEdit(temp) {
  isEdit.value = true;
  place.value = temp;
}

function closeAdd() {
  isAdd.value = false;
}

function closeEdit() {
  isEdit.value = false;
}

function openAddHotel() {
  isAddHotel.value = true;
  hotel.value = {
    name: "",
    address: "",
    website: "",
    destination_id: route.params.id,
  };
}

function openEditHotel(temp) {
  isEditHotel.value = true;
  hotel.value = temp;
}

function closeAddHotel() {
  isAddHotel.value = false;
}

function closeEditHotel() {
  isEditHotel.value = false;
}

async function addHotel(){
  // Use the hotel service to add a hotel
  await HotelService.createHotel(hotel.value)
    .then((response) => {
      fetchDestination();
      closeAddHotel();
      snackbar.value.color = "success";
      snackbar.value.text = "Hotel added successfully";
      snackbar.value.value = true;

    })
    .catch((error) => {
      console.error("Error in adding hotel:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in adding hotel";
      snackbar.value.value = true;
    });
}

async function updateHotel(){
  // Use the hotel service to update a hotel
  await HotelService.updateHotel(hotel.value)
    .then((response) => {
      fetchDestination();
      closeEditHotel();
      snackbar.value.color = "success";
      snackbar.value.text = "Hotel updated successfully";
      snackbar.value.value = true;

    })
    .catch((error) => {
      console.error("Error in updating hotel:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in updating hotel";
      snackbar.value.value = true;

    });
}

async function deleteHotel(selectedHotel){
  // Use the hotel service to delete a hotel
  await HotelService.deleteHotel(selectedHotel.id)
    .then((response) => {
      fetchDestination();
      closeEditHotel();
      snackbar.value.color = "success";
      snackbar.value.text = "Hotel deleted successfully";
      snackbar.value.value = true;

    })
    .catch((error) => {
      console.error("Error in deleting hotel:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in deleting hotel";
      snackbar.value.value = true;

    });
}

const isAddTrip = ref(false);
const isEditTrip = ref(false);
const trips = ref([]);

const newTrip = ref({
  name: "",
  destination_id: route.params.id,
  user_id: "",
  start_date: "",
  end_date: "",
});

function openAddTrip() {
  isAddTrip.value = true;
  newTrip.value = {
    name: "",
    destination_id: route.params.id,
    user_id: "",
    start_date: "",
    end_date: "",
  };
}

// Get the trips for the destination

async function getTrips() {
  await tripsService
    .getTripsByDestination(route.params.id)
    .then((response) => {
      trips.value = response.data;
    })
    .catch((error) => {
      console.error("Error in fetching trips:", error);
    });
}

async function showDetails(plan) {
  router.push({ name: "plan-details", params: { planId: plan.trip_id, id: destination.value.destination_id } });
}

// 
async function deleteTrip(selectedTrip){
  // Use the trip service to delete a trip
  await tripsService.deleteTrip(selectedTrip.trip_id)
    .then((response) => {
      fetchDestination();
      closeEditTrip();
      getTrips();
      snackbar.value.color = "success";
      snackbar.value.text = "Trip deleted successfully";
      snackbar.value.value = true;

    })
    .catch((error) => {
      console.error("Error in deleting trip:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in deleting trip";
      snackbar.value.value = true;

    });
}

async function addTrip() {
  // Use the trip service to add a trip
  await tripsService
    .createTrip(newTrip.value)
    .then((response) => {
      fetchDestination();
      getTrips();
      closeAddTrip();
      snackbar.value.color = "success";
      snackbar.value.text = "Trip added successfully";
      snackbar.value.value = true;
    })
    .catch((error) => {
      console.error("Error in adding trip:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in adding trip";
      snackbar.value.value = true;
    });
}

async function updateTrip() {
  // Use the trip service to update a trip
  await tripsService
    .updateTrip(newTrip.value.trip_id, newTrip.value)
    .then((response) => {
      fetchDestination();
      getTrips();
      closeEditTrip();
      snackbar.value.color = "success";
      snackbar.value.text = "Trip updated successfully";
      snackbar.value.value = true;
    })
    .catch((error) => {
      console.error("Error in updating trip:", error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error in updating trip";
      snackbar.value.value = true;
    });
}

function openEditTrip(temp) {
  isEditTrip.value = true;
  newTrip.value = temp;
}

function closeAddTrip() {
  isAddTrip.value = false;
}

function closeEditTrip() {
  isEditTrip.value = false;
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}


function closeSnackBar() {
  snackbar.value.value = false;
}

function bgHeight() {
    return this.$vuetify.breakpoint.height - 147 [5]
  }

</script>

<template>
  <v-app id="inspire"  >
    <v-main class="bg-grey-lighten-3" >
      <v-container >
        <v-row >
          <v-col  cols="12" sm="4">
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


          <v-col cols="12" sm="8" class="mt-10">
            <v-row align="center" class="mb-4">
              <v-col cols="10"><v-card-title class="pl-0 text-h4">Trips created in {{ destination.name }}
                </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn v-if="user !== null" color="accent" @click="openAddTrip()">Add trip</v-btn>
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
                    <v-icon size="small" icon="mdi-pencil" @click="openEditTrip(trip)"></v-icon>
                  </td>
                  <td>
                    <v-icon size="small" icon="mdi-delete" @click="deleteTrip(trip)"></v-icon>
                  </td>
                  <td>
                    <v-chip @click="showDetails(trip)" label append-icon="mdi-airplane" color="cyan">Details
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
          <v-col cols="12" sm="12">
            <v-row align="center" class="mb-4">
              <v-col cols="10"
                ><v-card-title class="pl-0 text-h4"
                  >Places to visit in {{ destination.name }}
                </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn v-if="user !== null" color="accent" @click="openAdd()"
                  >Add place</v-btn
                >
              </v-col>
            </v-row>

            <v-table class="rounded-lg elevation-5">
              <thead>
                <tr>
                  <th class="text-left">Place name</th>
                  <th class="text-left">description </th>
                  <th class="text-left">Address</th>
                  <th class="text-left">Edit</th>
                  <th class="text-left">Delete</th>
                  
                </tr>
              </thead>
              <tbody >
                <tr v-for="place in destination.Places" :key="place.name">
                  <td>{{ place.name }}</td>
                  <td>{{ place.description }}</td>
                  <td>{{ place.address }}</td>
                  <td>
                    <v-icon
                      size="small"
                      icon="mdi-pencil"
                      @click="openEdit(place)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-icon
                      size="small"
                      icon="mdi-delete"
                      @click="deletePlace(place)"
                    ></v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
          

          <v-col cols="12" sm="12">
            <v-row align="center" class="mb-4">
              <v-col cols="10"
                ><v-card-title class="pl-0 text-h4"
                  >Hotels to stay in {{ destination.name }}
                </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn v-if="user !== null" color="accent" @click="openAddHotel()"
                  >Add hotel</v-btn
                >
              </v-col>
            </v-row>

            <v-table class="rounded-lg elevation-5">
              <thead>
                <tr>
                  <th class="text-left">Hotel name</th>
                  <th class="text-left">Address</th>
                  <th class="text-left">Website</th>
                  <th class="text-left">Edit</th>
                  <th class="text-left">Delete</th>
                  
                </tr>
              </thead>
              <tbody >
                <tr v-for="hotel in destination.Hotels" :key="hotel.name">
                  <td>{{ hotel.name }}</td>
                  <td>{{ hotel.address }}</td>
                  <td>{{ hotel.website }}</td>
                  <td>
                    <v-icon
                      size="small"
                      icon="mdi-pencil"
                      @click="openEditHotel(hotel)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-icon
                      size="small"
                      icon="mdi-delete"
                      @click="deleteHotel(hotel)"
                    ></v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>

          <v-dialog persistent :model-value="isAdd || isEdit" width="800">
            <v-card class="rounded-lg elevation-5">
              <v-card-item>
                <v-card-title class="headline mb-2"
                  >{{ isAdd ? "Add place" : isEdit ? "Edit place" : "" }}
                </v-card-title>
              </v-card-item>
              <v-card-text>
                <v-text-field
                  v-model="place.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="place.description"
                  label="Description"
                ></v-text-field>
                <v-text-field
                  v-model="place.address"
                  label="Address"
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
                  @click="isAdd ? addPlace() : isEdit ? updatePlace() : false"
                  >{{
                    isAdd ? "Add place " : isEdit ? "Update place" : ""
                  }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>


          <v-dialog persistent :model-value="isAddHotel || isEditHotel" width="800">
            <v-card class="rounded-lg elevation-5">
              <v-card-item>
                <v-card-title class="headline mb-2"
                  >{{ isAddHotel ? "Add hotel" : isEditHotel ? "Edit hotel" : "" }}
                </v-card-title>
              </v-card-item>
              <v-card-text>
                <v-text-field
                  v-model="hotel.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="hotel.address"
                  label="Address"
                ></v-text-field>
                                <v-text-field
                  v-model="hotel.website"
                  label="Website"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  variant="flat"
                  color="secondary"
                  @click="isAddHotel ? closeAddHotel() : isEditHotel ? closeEditHotel() : false"
                  >Close</v-btn
                >
                <v-btn
                  variant="flat"
                  color="primary"
                  @click="isAddHotel ? addHotel() : isEditHotel ? updateHotel() : false"
                  >{{
                    isAddHotel ? "Add hotel " : isEditHotel ? "Update hotel" : ""
                  }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>


          <v-dialog persistent :model-value="isAddTrip || isEditTrip" width="800">
            <v-card class="rounded-lg elevation-5">
              <v-card-item>
                <v-card-title class="headline mb-2">{{ isAddTrip ? "Add Trip" : isEditTrip ? "Edit trip" : "" }}
                </v-card-title>
              </v-card-item>
              <v-card-text>
                <v-text-field v-model="newTrip.name" label="Name" required></v-text-field>

                <v-text-field v-model="newTrip.start_date" label="Start date" type="date"></v-text-field>
                <v-text-field v-model="newTrip.end_date" label="End date" type="date"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="secondary"
                  @click="isAddTrip ? closeAddTrip() : isEditTrip ? closeEditTrip() : false">Close</v-btn>
                <v-btn variant="flat" color="primary" @click="isAddTrip ? addTrip() : isEditTrip ? updateTrip() : false">{{
                  isAddTrip ? "Add Trip " : isEditTrip ? "Update Trip" : ""
                }}</v-btn>
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