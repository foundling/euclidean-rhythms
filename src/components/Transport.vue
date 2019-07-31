<template>
  <div class="transport">
    <button @click="startSequence" class="fas fa-play">Start</button>
    <button @click="stopSequence"  class="fas fa-stop">Stop</button>
    <button @click="pauseSequence" class="fas fa-pause">Pause</button>
  </div>
</template>

<script>

  /*

  play stop pause
  n / k


  */
  export default {
    name: 'Transport',
    props: {
      audioContext: Object,
    },
    data: function() {
      return {
        _n: this.n,
        _k: this.k
      }
    },
    methods: {
      updateK() {
        this.emit('transport-update-k', this.K)
      }
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
    }
  }

</script>

<style lang="scss" scoped>
</style>


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
        @click="selectNote(index)"
        :id="`step-${index}`"
        :class="{ 
          'active-step': isActiveStep(index, ui.activeStep),
          'pulse': circle.isPulse,
          'selected-note': isSelectedNote(index, selectedStepIndex) 
        }"
        :cx="circle.cx" 
        :cy="circle.cy"
        :key="index"
        r="20"> 
      </circle>
    </svg>

    <Transport />
    <button @click="startSequence" class="fas fa-play">Start</button>
    <button @click="stopSequence"  class="fas fa-stop">Stop</button>
    <button @click="pauseSequence" class="fas fa-pause">Pause</button>

    <TempoControl 
      v-on:tempo-change="updateTempo" 
      :initial-tempo="tempo" />

    <SourceEditor :stepsData="stepsData" :index="selectedStepIndex" />

  </div>
</template>

<script>

  import { range } from '../lib/utils'
  import { degreesToRadians, ER, initSequence } from '../lib/equations'
  import Sequencer from '../lib/Sequencer'
  import TempoControl from './TempoControl'
  import Transport from './Transport'
  import SourceEditor from './SourceEditor'

  export default {
    name: 'Sequencer',
    components: {
      TempoControl,
      Transport,
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
        stepsData: [],
        selectedStepIndex: -1,
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
      selectNote(index) {
        this.selectedStepIndex = index
      },
      updateTempo(newTempo) {
        this.tempo = parseInt(newTempo)
      },
      isSelectedNote(stepIndex, selectedStepIndex) {
        return stepIndex === selectedStepIndex
      },
      isActiveStep(stepIndex, activeStep) {
        return stepIndex === activeStep || stepIndex < 0
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

        &.selected-note {
          stroke: red;
          stroke-width: 3;
        }
        &.active-step {
          fill: coral;
          stroke: yellow;
          stroke-width: 3;
        }
        &.pulse {
          fill: darkslateblue;
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
