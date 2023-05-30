<script>
import DestinationList from "../components/DestinationList.vue";
import destinationService from "../services/DestinationService.js";

export default {
  name: "Destinations",
  components: {
    DestinationList,
  },
  data() {
    return {
      destinations: [],
    };
  },
  mounted() {
    this.fetchDestinations();
  },

  methods: {
    async fetchDestinations() {
      try {
        // Use the destination service to fetch all destinations
        this.destinations = await destinationService.getAllDestinations();
      } catch (error) {
        console.error("Error in fetching destinations:", error);
      }
    },
  },
};
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Destinations
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()">
            Add</v-btn
          >
        </v-col>
      </v-row>
    </div>
  </v-container>
  <div>
    <h1>All Destinations</h1>
    <DestinationList :destinations="destinations" />
  </div>
</template>
