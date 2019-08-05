<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

  .sequencer {
    background: $gray-medium;
    width: 100%; 
    height: 100%;

    circle {

      fill: white;

      &.active-step {
        fill: coral;
        stroke: yellow;
        stroke-width: 3;
      }
      &.editing {
        stroke: red;
        stroke-width: 3px;
      }
      &.pulse.active-step {
        fill: coral;
      } 
      &.pulse.track-1 {
        fill: $track-1;
      }

      &.pulse.track-2 {
        fill: $track-2;
      }

      &.pulse.track-3 {
        fill: $track-3;
      }

      &.pulse.track-4 {
        fill: $track-4;
      }

      &.pulse {
        fill: aqua;
      }
      &.step {
        fill: black;
      }
      &.center {
        stroke: white;
        stroke-width: 3;
        fill: black;
      }

    }

  }
</style>

<template>
  <svg 
    class="sequencer"
    width="100%" 
    height="100%">
  
    <circle
      @click="addPulse"
      class="center"
      cx="200"
      cy="200"
      r="20" />

    <circle 
      v-for="(circle, index) in circles" 
      @click="setEditable(index)"
      :id="`step-${index}`"
      :class="{ 
        'editing': isEditable(index),
        'active-step': isActiveStep(index, ui.activeStep),
        'pulse': circle.isPulse, 
        ['track-' + (trackIndex + 1)]: true 
      }"
      :cx="circle.cx"
      :cy="circle.cy"
      :key="index"
      r="20" /> 

  </svg>
</template>

<script>

  import { range } from '../lib/utils'
  import { ER, degreesToRadians } from '../lib/equations'
  import Sequencer from '../lib/Sequencer'
  import Synth from '../lib/Synth'

  export default {
    name: 'Sequencer',
    components: {},
    props: {
      trackIndex: {
        type: Number
      },
      pulses: {
        type: Number
      },
      steps: {
        type: Number
      },
      trackCount: {
        type: Number
      },
      tracks: {
        type: Array
      },
      stepEditIndex: {
        type: Number
      }
    },
    data: function() {
      return {
        n: this.steps,
        k: this.pulses,
        ui: { 
          activeStep: null 
        }
      }
    },
    created() {
      this.sequencer = new Sequencer({
        ui: this.ui,
        audioContext: new (window.AudioContext || AudioContext), 
        tracks: this.tracks,
        trackIndex: this.trackIndex,
      })
      this.sequencer.init()
    },
    methods: {
      updateSelectedTrack(newTrackIndex) {
        this.trackIndex = newTrackIndex
      },
      setSequences(n, k, sequenceCount) {
        return range(sequenceCount).map(_ => ER(n, k))
      },
      setSequence(n, k) {
        return ER(n, k)
      },
      setEditable(index) {
        this.$emit('step-edit-index-updated', index)
      },
      isEditable(index) {
        return index === this.stepEditIndex
      },
      isActiveStep(stepIndex, activeStep) {
        return stepIndex === activeStep
      },
      calculateStepData(n, k, A) {
        return range(n).map((_, index) => {
          return A[index] ? Object.assign(Synth.defaultSettings, { sourceType: 'synth' }) : null
        })
      },
      addPulse() {
        // increases k for this track
        // re-runs ER for n,k

        const track = this.tracks[this.trackIndex] 
        track.k = (track.k + 1 > track.n) ? 0 : track.k + 1

        track.sequence = ER(track.n, track.k)
        this.stepData = this.calculateStepData(track.n, track.k, track.sequence)

        this.sequencer.updateSequence(this.trackIndex, track.sequence)

      },
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
      }
    },
    watch: {
      state: function(newState) {

        if (newState === this.state)
          return

        if (newState === 'started')
          this.sequencer.start()

        else if (newState === 'stopped')
          this.sequencer.stop()

        else if (newState === 'paused')
          this.sequencer.pause()

      }
    },
    computed: {
      sequence() {
        return this.tracks[this.trackIndex].sequence
      },
      circles() {

        const radius = 160
        const offsetAngle = 90
        const centerCoords = { x: 200, y: 200 }
        const radiansPerCircle = 360.0/this.n
        const sequence = this.sequence

        return sequence.map((_, index) => radiansPerCircle * index)
          .map((radians, index) => ({
            isPulse: sequence[index],
            cx: radius * Math.cos(degreesToRadians(radians - offsetAngle)) + centerCoords.x,
            cy: radius * Math.sin(degreesToRadians(radians - offsetAngle)) + centerCoords.y
          }))

      },
      
    }
  }

</script>

