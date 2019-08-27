<template>
  <div class="transport">

    <div class="playhead-controls">
      <button @click="start" :class="{ engaged: state === 'started' }" class="start-button fas fa-play" />
      <button @click="stop"  :class="{ engaged: state === 'stopped' }" class="stop-button fas fa-stop" />
      <button @click="pause" :class="{ engaged: state === 'paused'  }" class="pause-button fas fa-pause" />
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
        state: null
      }
    },
    created() {

      const self = this

      function updateTransportState() { self.state = this.state }

      this.transport = new Transport({ 
        bpm: this.tempo,
        onStart: updateTransportState,
        onStop: updateTransportState,
        onPause: updateTransportState,
      })

      this.state = this.transport.transport.state

    },
    methods: {
      updateTempo(newTempo) {
        this.$emit('transport-tempo-updated', newTempo)
      },
      start() {
        this.transport.start()
        this.$emit('transport-started')
      },
      pause() {
        this.transport.pause()
        this.$emit('transport-paused')
      },
      stop() {
        this.transport.stop()
        this.$emit('transport-stopped')
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

  @import '@/assets/scss/colors.scss';

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

        &:focus {
          outline: none;
        }

        &.engaged {
          color: $red;
        }
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
