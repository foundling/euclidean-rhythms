<template>
  <div class="tempo-control">
    <label>Tempo: </label>
    <input 
      @input="onTempoChange"
      v-model="tempo"
      type="range" 
      min="1" 
      max="300" />
    {{ tempo }}
  </div>
</template>

<script>

  export default {
    name: 'TempoControl',
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
