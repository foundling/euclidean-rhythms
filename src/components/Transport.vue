<template>
  <div class="transport">

    <div class="playhead-controls">
      <button @click="start" class="fas fa-play" />
      <button @click="stop" class="fas fa-stop" />
      <button @click="pause" class="fas fa-pause" />
    </div>

    <Tempo v-on:tempo-change="updateTempo" :tempo="tempo" />

  </div>

</template>

<script>

  import Tempo from './Tempo'
  import Transport from '../lib/Transport'

  export default {
    name: 'Transport',
    components: { Tempo },
    props: {
      tempo: {
        type: Number
      }
    },
    data: function() {
      return {
        transport: new Transport({ bpm: this.tempo })
      }
    },
    methods: {
      updateTempo(newTempo) {
        this.$emit('tempo-updated', newTempo)
      },
      start() {
        this.transport.start()
      },
      pause() {
        this.transport.pause()
      },
      stop() {
        this.transport.stop()
      },

    },
    watch: {
      tempo: function(newTempo) {
        this.transport.tempo = newTempo
      }
    }
  }

</script>

<style lang="scss" scoped>

  .transport {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .playhead-controls {

      button {
        font-size: 2.3em;
        border: none;
        background: transparent;
        padding: 10px;
      }

      button:first-child {
        padding: 0px 10px;
      }

      button:last-child {
        padding: 0px 10px;
      }
    }
  }

</style>
