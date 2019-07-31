<template>
  <div class="container">
    <svg width="100%" height="100%">
      <circle
        @click="addPulse"
        class="center"
        cx="200"
        cy="200"
        r="20">
      </circle>
      <circle 
        v-for="(circle, index) in circles" 
        @click="setEditable(index)"
        :id="`step-${index}`"
        :class="{ 
          'editing': isEditable(index),
          'active-step': isActiveStep(index, ui.activeStep),
          'pulse': circle.isPulse 
        }"
        :cx="circle.cx" 
        :cy="circle.cy"
        :key="index"
        r="20"> 
      </circle>
    </svg>

    <div class="transport">
      <button @click="startSequence" class="fas fa-play">Start</button>
      <button @click="stopSequence" class="fas fa-stop">Stop</button>
      <button @click="pauseSequence" class="fas fa-pause">Pause</button>
    </div>

    <TempoControl 
      v-on:tempo-change="updateTempo" 
      :initial-tempo="tempo" />

    <SourceEditor />

  </div>
</template>

<script>

  import { range } from '../lib/utils'
  import { degreesToRadians, ER, initSequence } from '../lib/equations'
  import Sequencer from '../lib/Sequencer'
  import TempoControl from './TempoControl'
  import SourceEditor from './SourceEditor'

  export default {
    name: 'Sequencer',
    components: {
      TempoControl,
      SourceEditor
    },
    props: {
      pulses: {
        type: Number
      },
      steps: {
        type: Number
      },
      initialTempo: {
        type: Number
      }

    },
    data: function() {
      return {
        ui: { 
          activeStep: -1 
        },
        editIndex: null,
        tempo: this.initialTempo,
        n: this.steps,
        k: this.pulses,
      }
    },
    created() {
      this.sequencer = new Sequencer({
        audioContext: new (window.AudioContext || AudioContext), 
        tempo: this.tempo,
        sequence: this.sequence,
        ui: this.ui,
      })
      this.sequencer.init()
    },
    methods: {
      setEditable(index) {
        this.editIndex = index
      },
      updateTempo(newTempo) {
        this.tempo = parseInt(newTempo)
      },
      isEditable(index) {
        return index === this.editIndex
      },
      isActiveStep(stepIndex, activeStep) {
        return stepIndex === activeStep || stepIndex === 0 && activeStep === -1
      },
      distributePulses: ER,
      addPulse() {
        this.k = (this.k + 1 > this.n ? 1 : this.k + 1)
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
      sequence: function(newSeq, oldSeq) {
        this.sequencer.updateSequence(newSeq)
      },
      tempo: function(newTempo) {
        this.sequencer.updateTempo(parseInt(newTempo))
      }
    },
    computed: {
      sequence() {
        return this.distributePulses(this.n, this.k, initSequence(this.n, this.k))
      },
      circles() {

        const radius = 160
        const offsetAngle = 90
        const centerCoords = { x: 200, y: 200 }

        return range(this.n)
          .map(step => (360/this.n) * step)
          .map((angle, index) => ({
            isPulse: this.sequence[index],
            cx: radius * Math.cos(degreesToRadians(angle - offsetAngle)) + centerCoords.x,
            cy: radius * Math.sin(degreesToRadians(angle - offsetAngle)) + centerCoords.y
          }))

      },
      
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

      circle {

        stroke: black;
        fill: white;

        &.editing {
          stroke: red;
          stroke-width: 3px;
        }
        &.active-step {
          fill: coral;
          stroke: yellow;
          stroke-width: 3;
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

  }
</style>
