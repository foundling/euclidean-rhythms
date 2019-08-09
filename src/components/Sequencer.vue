<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

  .sequencer {
    background: $gray-medium;
    width: 100%; 
    height: 100%;

    circle {
      fill: white;

      &:focus {
        outline: none;
      }

      &.active-step {
        fill: coral;
        stroke: yellow;
        stroke-width: 3;
      }

      &.editing {
        stroke: red;
        stroke-width: 3px;
      }

      &.pulse.track {
        fill: $track-1;
      }

      &.pulse.active-step {
        fill: coral;
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
      @keyup.enter="addPulse"
      tabindex="1"
      class="center"
      cx="200"
      cy="200"
      r="20" />

    <circle 
      v-for="(circle, index) in circles" 
      @click.exact="setEditable(index)"
      @click.shift.exact="setEditable(index, true)"
      @keyup.enter="setEditable(index)"
      :tabindex="index + 2"
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
      direction: {
        type: String,
        validator: dir => ['clockwise','counter-clockwise'].includes(dir)
      },
      pulses: Number,
      steps: Number,
      stepEditIndexes: Array,
      trackCount: Number,
      trackIndex: Number,
      tracks: Array,
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
        audioContext: new (window.AudioContext || AudioContext), 
        trackIndex: this.trackIndex,
        tracks: this.tracks,
        ui: this.ui,
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
      setEditable(index, multiple=false) {
        // if multiple is true, take the last step edit index in the array that is also a pulse
        this.$emit('step-edit-index-updated', index, multiple)
      },
      isEditable(index) {
        // there may be stepEditIndexes values that aren't valid because
        // they aren't on a pulse
        return this.tracks[this.trackIndex].sequence[index] && this.stepEditIndexes.includes(index)
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
      trackIndex(newIndex, oldIndex) {
        this.sequencer.trackIndex = newIndex
      },
      direction(newDirection, oldDirection) {
        this.tracks[this.trackIndex]
        if (newDirection !== oldDirection) {
          this.sequencer.reverseDirection(newDirection)
        }
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

