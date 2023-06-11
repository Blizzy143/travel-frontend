<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import destinationService from "../services/DestinationService.js";

const route = useRouter();

const destination = ref({});
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  fetchDestination();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function fetchDestination() {
  // Use the destination service to fetch the destination
  console.log(route.params.id);
  await destinationService
    .getDestinationById(route.params.id)
    .then((response) => {
      destination.value = response.data[0];
      console.log("destination ++++>" + destination.value);
    })
    .catch((error) => {
      console.error("Error in fetching destination:", error);
    });
}
function navigateToDestinations() {
  route.push({ name: "destinations" });
}
</script>

<template>
  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12" sm="4">
            <v-card class="mx-auto" max-width="344">
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                height="200px"
                cover
              ></v-img>

              <v-card-title v-model="destination.name" >Top western road trips</v-card-title>

              <v-card-subtitle v-model="destination.rating"> 1,000 miles of wonder </v-card-subtitle>

              <v-card-actions>
                <v-btn color="orange-lighten-2" variant="text"> Explore </v-btn>

                <v-spacer></v-spacer>

                <v-btn
                  :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="show = !show"
                ></v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>

                  <v-card-text
                  v-model="destination.description"
                  >
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>

          <v-col cols="12" sm="8">
            <v-sheet min-height="70vh" rounded="lg">
              <!--  -->
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>