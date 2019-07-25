<template>
  <div class="container">
    <svg width="100%" height="100%">
      <circle
        @click="increasePulses"
        class="center"
        cx="200"
        cy="200"
        r="20">
      </circle>
      <circle 
        v-for="(circle, index) in circles" 
        :class="{'active-step': index === ui.activeStep, 'pulse': circle.isPulse }"
        :cx="circle.cx" 
        :cy="circle.cy"
        :key="index"
        r="20"> 
      </circle>
    </svg>
    <button @click="startSequence" class="fas fa-play">Start</button>
    <button @click="stopSequence" class="fas fa-stop">Stop</button>
    <button @click="pauseSequence" class="fas fa-pause">Pause</button>
  </div>
</template>

<script>

  import { range } from '../lib/utils'
  import { degreesToRadians, ER } from '../lib/equations'
  import Sequencer from '../lib/Sequencer'

  export default {
    name: 'Sequencer',
    props: {
      steps: {
        type: Number
      }
    },
    data: function() {

      return {
        ui: {
          activeStep: 0
        },
        pulseCount: 1,
      }

    },
    created() {

      const sequencer = this.sequencer = new Sequencer({
        audioContext: new (window.AudioContext || AudioContext), 
        ui: this.ui,
        distributedPulses: this.distributedPulses,
      })

      sequencer.init()

    },
    methods: {
      increasePulses() {
        this.pulseCount = (this.pulseCount + 1 > this.steps ? 1 : this.pulseCount + 1)
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
      circles() {

        const radius = 160
        const offsetAngle = 90
        const centerCoords = { x: 200, y: 200 }

        return range(this.steps)
          .map(step => (360/this.steps) * step)
          .map((angle, index) => ({
            isPulse: this.distributedPulses[index],
            cx: radius * Math.cos(degreesToRadians(angle - offsetAngle)) + centerCoords.x,
            cy: radius * Math.sin(degreesToRadians(angle - offsetAngle)) + centerCoords.y
          }))

      },
      distributedPulses() {

        const n = this.steps
        const k = this.pulseCount
        const A = [
          ...range(k).map(_ => '1'),
          ...range(n - k).map(_ => '0')
        ].join('').split('')

        return ER(n, k, A)
        .split('')
        .map(Number)
        .reduce((memo, isPulse, index) => {
          memo[index] = Boolean(isPulse)
          return memo
        },{})
          
      }
    }
  }

</script>

<style lang="scss" scoped>
  .container {

    margin: 0;
    padding: 0;
    width: 400px;
    height: 400px;
    background: lightgray;

    svg {
      width: 100%; 
      height: 100%;

      circle.active-step {
        fill: yellow;
        stroke: orange;
        stroke-width: 3;
      }

      circle.pulse {
        fill: green;
      }

      circle.step {
        fill: black;
      }
      circle.center {
        fill: white;
      }
    }

  }
</style>
