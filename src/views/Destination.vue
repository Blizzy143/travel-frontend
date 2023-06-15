<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import destinationService from "../services/DestinationService.js";
import PlaceService from "../services/PlaceService.js";


const route = useRoute();

const destination = ref({});
const isAdd = ref(false);
const isEdit = ref(false);
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


onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  fetchDestination();
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
      snackbar.value = {
        value: true,
        color: "success",
        text: "Place added successfully",
      };
    })
    .catch((error) => {
      console.error("Error in adding place:", error);
      snackbar.value = {
        value: true,
        color: "error",
        text: "Error in adding place",
      };
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
                  >Places to visit in {{ destination.name }}
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