<template>
  <div class="step-counter">
    <label>Steps: </label>
    <input 
      type="text"/>
    {{ tempo }}
  </div>
</template>

<script>

  export default {
    name: 'Steps',
    props: {
      initialTempo: {
        type: Number,
      } 
    },
    data: function() {
      return {
        tempo: this.initialTempo
      }
    },
    methods: {
      onTempoChange() {
        this.$emit('tempo-change', this.tempo)
      }
    },
    computed: {
    }
  }

</script>

<style lang="scss" scoped>
  .tempo-control {
    label {
    }
  }
</style>
