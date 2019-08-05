<template>
  <div class="tempo-control">
    <input 
      @input="onTempoChange"
      v-model.number="tempo$"
      class="tempo"
      type="number" 
      min="1" 
      max="300" />
  </div>
</template>

<style lang="scss" scoped>
  .tempo-control {
    padding: 10px;
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

<script>

  export default {
    name: 'TempoControl',
    props: {
      tempo: {
        type: Number,
      } 
    },
    data: function() {
      return {
        tempo$: this.tempo
      }
    },
    methods: {
      onTempoChange() {
        this.$emit('tempo-change', this.tempo$)
      }
    }
  }

</script>
