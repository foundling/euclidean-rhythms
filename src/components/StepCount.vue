<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

</style>

<template>

  <div>

    <label>Step Count: {{ stepCount }} </label>

    <button class="decrement" @click="updateStepCount(-1)">-</button>
    <button class="increment" @click="updateStepCount(+1)">+</button>

  </div>

</template>

<script>

  export default {
    name: 'StepCount',
    props: {
      stepCount: Number
    },
    methods: {
      updateStepCount(steps) {
        this.$emit('step-count-updated', stepCount + steps)
      }
    }
  }

</script>

