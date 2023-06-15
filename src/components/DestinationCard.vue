<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const user = ref(null);

const props = defineProps({
  destination: {
    required: true,
  },
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

function navigateToDestination() {
  router.push({ name: "destination", params: { id: props.destination.destination_id } });
}
</script>

<template>

<v-card

@click="navigateToDestination()"
 class="rounded-lg elevation-5 mx-auto mb-4" max-width="600">
    <v-img
      class="align-end text-white"
      height="300"
      v-bind:src="destination.image"
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

  </v-card>


  </template>
