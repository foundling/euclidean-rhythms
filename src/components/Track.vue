<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

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

    &.muted {
      fill: $gray-dark;
    }

  }

</style>

<template>

  <g>
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
        'muted': track.sequence.muted 
      }"
      :cx="circle.cx"
      :cy="circle.cy"
      :key="index"
      r="20" /> 
  </g>

</template>

<script>

  import { range } from '../lib/utils'
  import { ER, degreesToRadians } from '../lib/equations'
  import Sequencer from '../lib/Sequencer'
  import Synth from '../lib/Synth'

  export default {
    name: 'Track',
    components: {},
    props: {
      track: {
        type: Object,
        required: true 
      }
    },
    data: function() {
      return {
        ui: {
          activeStep: -1
        }
      }
    },
    computed: {
      circles() {

        const radius = 160
        const offsetAngle = 90
        const centerCoords = { x: 200, y: 200 }
        const radiansPerCircle = 360.0/this.track.sequence.n
        const sequence = this.track.sequence

        return range(sequence.n).map(index => radiansPerCircle * index)
          .map((radians, index) => ({
            isPulse: sequence.get(index),
            cx: radius * Math.cos(degreesToRadians(radians - offsetAngle)) + centerCoords.x,
            cy: radius * Math.sin(degreesToRadians(radians - offsetAngle)) + centerCoords.y
          }))

      }
    },
    methods: {
      isEditable() {},
      setEditable() {},
      isActiveStep() {}
    }

  }

</script>

