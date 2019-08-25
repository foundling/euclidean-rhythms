<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

  .active {
    color: $red;
  }

</style>

<template>

  <div>

    <label>Rotation: {{ stepsRotated }} </label>

    <button class="decrement" @click="$emit('rotation-updated', -1)">-</button>
    <button class="increment" @click="$emit('rotation-updated', +1)">+</button>

  </div>

</template>

<script>

  export default {
    name: 'Rotation',
    props: {
      stepsRotated: Number
    }
  }

</script>

