<template>
  <div class="transport">

    <div class="playhead-controls">
      <button @click="updateTransportState('started')" class="fas fa-play" />
      <button @click="updateTransportState('stopped')"  class="fas fa-stop" />
      <button @click="updateTransportState('paused')" class="fas fa-pause" />
    </div>

    <Tempo 
    v-on:tempo-change="updateTempo" 
    :tempo="tempo" />
  </div>

</template>

<script>

  import Tempo from './Tempo'

  export default {
    name: 'Transport',
    components: {
      Tempo
    },
    props: {
      tempo: {
        type: Number
      },
      transportState: {
        type: String,
        validator(s) {
          return ['started','stopped','paused'].includes(s)
        }
      }
    },
    data: function() {
      return {
        state: this.transportState
      }
    },
    methods: {
      updateTransportState(newState) {

        if (this.state === newState)
          return

        this.state = newState
        this.$emit(`transport-${this.state}`, this.state)

      }
    },
    watch: {
      tempo: function(newTempo) {
        this.updateTempo(newTempo)
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
    .tempo-controls {
    }

  }
</style>
