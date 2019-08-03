<template>
  <div class="tempo-control">
    <label>Tempo: </label>
    <input 
      class="tempo"
      @input="onTempoChange"
      v-model.number="tempo"
      type="number" 
      min="1" 
      max="300" />
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
    }
  }

</script>

<style lang="scss" scoped>
  .tempo-control {
    input.tempo {
      padding-left: 10px;
      font-size: 2em; 
      background: white;
      font-family: monospace;
    }
  }
</style>
