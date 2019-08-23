<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

  .sequencer {
    background: $gray-medium;
    width: 100%; 
    height: 100%;

    circle {
      fill: scale-color($track-1, $lightness: 90%);

      &:focus {
        outline: none;
      }

      &.pulse.active-step {
        fill: white;
        stroke: scale-color($track-1, $lightness: 10%);
        stroke-width: 3;
      } 

      &.active-step {
        stroke: $red;
        stroke-width: 3;
        stroke: scale-color($track-1, $lightness: 10%);
      }

      &.editing {
        stroke: $red;
        stroke-width: 3px;
      }

      &.pulse.track {
        fill: $track-1;
      }

      &.pulse {
        fill: $track-1;
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
      @click="updatePulseCount"
      @keyup.enter="updatePulseCount"
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
      //steps: Number,
      stepEditIndexes: Array,
      trackIndex: Number,
      tracks: {
        type: Array,
        required: true
      },
    },
    data: function() {
      return {
        ui: { activeStep: null }
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
      isEditable(index) {
        // there may be stepEditIndexes values that aren't valid because
        // they aren't on a pulse
        return this.currentTrack.sequence[index] && this.stepEditIndexes.includes(index)
      },
      isActiveStep(stepIndex, activeStep) {
        return stepIndex === activeStep
      },
      setEditable(index, multiple=false) {
        // if multiple is true, take the last step edit index in the array that is also a pulse
        this.$emit('step-edit-index-updated', index, multiple)
      },
      updateSelectedTrack(newTrackIndex) {
        this.trackIndex = newTrackIndex
      },
      calculateStepData(n, k, A) {
        return range(n).map((_, index) => {
          return A[index] ? Object.assign(Synth.defaultSettings, { sourceType: 'synth' }) : null
        })
      },
      updatePulseCount() {

        const { steps, pulses } = this.currentTrack
        const updateFn = PULSE_MODES[this.pulseMode] 

        this.$emit('pulse-count-updated', {
          pulses: updateFn(steps, pulses),
          trackIndex: this.trackIndex
        })

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
    computed: {
      currentTrack() {
        return this.tracks[this.trackIndex]
      },
      stepData() {
        const { sequence, steps, pulses } = this.currentTrack
        return this.calculateStepData(steps, pulses, sequence)
      },
      circles() {
        const radius = 160
        const offsetAngle = 90
        const centerCoords = { x: 200, y: 200 }

        // shouldn't this be on a track level? 
        const radiansPerCircle = 360.0/this.currentTrack.steps
        const activeSequence = this.sequence

        return activeSequence.map((_, index) => radiansPerCircle * index)
          .map((radians, index) => ({
            isPulse: activeSequence[index],
            cx: radius * Math.cos(degreesToRadians(radians - offsetAngle)) + centerCoords.x,
            cy: radius * Math.sin(degreesToRadians(radians - offsetAngle)) + centerCoords.y
          }))
      },
    },
    watch: {
      trackIndex(newIndex, oldIndex) {
        this.sequencer.trackIndex = newIndex
      },
      direction(newDirection, oldDirection) {
        if (newDirection !== oldDirection) {
          this.sequencer.reverseDirection(newDirection)
        }
      },
      sequence(newSequence, oldSequence) {
        this.sequencer.updateSequence(this.trackIndex, this.currentTrack.sequence)
      }
    },
  }

</script>
