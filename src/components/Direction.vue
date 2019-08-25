<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

  .active {
    color: $red;
  }

</style>

<template>

  <div>

    <label>Track Direction: </label>
    <button
    class="fas fa-caret-left"
    :class="{active: direction === 'counter-clockwise'}" 
    @click="$emit('direction-updated', 'counter-clockwise')" />

    <button 
    class="fas fa-caret-right" 
    :class="{active: direction === 'clockwise'}" 
    @click="$emit('direction-updated', 'clockwise')" />

  </div>

</template>

<script>

  export default {
    name: 'Direction',
    props: {
      direction: {
        type: String,
        required: true, 
        validator(direction) {
          return ['clockwise','counter-clockwise'].includes(direction)
        }
      }
    }
  }

</script>

