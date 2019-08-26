<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

  .active {
    color: $red;
  }

</style>

<template>

  <div>
    <label>Rotation: {{ stepsRotated * rotationMagnitude }}</label>
    <button 
    :class="{active: stepsRotated * rotationMagnitude < 0 }"
    class="fa fa-caret-left decrement" @click="updateRotation(-1)" /> 
    <button 
    :class="{active: stepsRotated * rotationMagnitude > 0 }"
    class="fa fa-caret-right" @click="updateRotation(+1)" />
  </div>

</template>

<script>

  export default {
    name: 'Rotation',
    props: {
      stepsRotated: Number,
      rotationMagnitude: Number
    },
    methods: {
      updateRotation(magnitude) {
        this.$emit('rotation-updated', magnitude)
      }
    }
  }

</script>

