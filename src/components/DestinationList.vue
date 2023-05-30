<template>
  <div>
    <ul>
      <li v-for="destination in destinations" :key="destination.id">
        <DestinationCard :destination="destination" />
      </li>
    </ul>
  </div>
</template>

<script>
import DestinationCard from '../components/DestinationCard.vue';

export default {
  name: 'DestinationList',
  props: {
    destinations: {
      type: Array,
      required: true,
    },
  },
  components: {
    DestinationCard,
  },
};
</script>
