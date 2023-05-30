<template>
  <div>
    <h3>{{ destination.name }}</h3>
    <p>{{ destination.country }}</p>
  </div>
</template>

<script>
export default {
  name: 'DestinationCard',
  props: {
    destination: {
      type: Object,
      required: true,
    },
  },
};
</script>
