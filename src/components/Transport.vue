<template>
  <div class="transport">

    <div class="playhead-controls">
      <button @click="startSequence" class="fas fa-play" />
      <button @click="stopSequence"  class="fas fa-stop" />
      <button @click="pauseSequence" class="fas fa-pause" />
    </div>

    <Tempo 
    v-on:tempo-change="updateTempo" 
    :initial-tempo="tempo" />
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
      sequencer: {
        type: Object
      },
      tempo: {
        type: Number
      }
    },
    data: function() {
      return {
      }
    },
    methods: {
      startSequence() {
        if (this.sequencer.state !== 'started')
          this.sequencer.start()
      },
      stopSequence() {
        if (this.sequencer.state !== 'stopped')
          this.sequencer.stop()
      },
      pauseSequence() {
        if (this.sequencer.state !== 'paused')
          this.sequencer.pause()
      },
      updateTempo(newTempo) {
        // listening twice to tempo-change.  event bus?
        // https://stackoverflow.com/questions/42615445/vuejs-2-0-emit-event-from-grand-child-to-his-grand-parent-component
        this.$emit('tempo-change', newTempo)
      },
    },
    watch: {
      tempo: function(newTempo) {
        this.sequencer.updateTempo(newTempo)
      }
    }
  }

</script>

<style lang="scss" scoped>
  .transport {
    display: flex;
    align-items: baseline;

    .playhead-controls {

       button {
        font-size: 2.3em;
        border: none;
        background: transparent;
        padding: 10px;
      }

    }

  }
</style>
