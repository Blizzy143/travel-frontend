<template>
  <v-card class="mx-auto" max-width="600">
    <v-img
      class="align-end text-white"
      height="300"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      cover
    >
      <v-card-title>{{ destination.name }}</v-card-title>
    </v-img>

    <v-card-subtitle class="pt-4">
      Rating - {{ destination.rating }}
    </v-card-subtitle>

    <v-card-text>

      <div>{{ destination.description }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="blue"> Share </v-btn>

      <v-btn color="green"> Explore </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DestinationCard",
  props: {
    destination: {
      type: Object,
      required: true,
    },
  },
};
</script>
