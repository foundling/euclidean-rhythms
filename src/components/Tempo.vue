<template>
  <div class="tempo-control">
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
      border: 1px solid black;
      text-align: right; // why align right to center it? 
      font-size: 2em; 
      color: white;
      background: black;
      font-family: monospace;
    }
  }
</style>
