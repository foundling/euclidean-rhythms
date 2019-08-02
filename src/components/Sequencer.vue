<style lang="scss" scoped>

  .container {

    margin: 0;
    padding: 0;
    width: 400px;
    height: 400px;
    background: lightgray;

    .transport > button {
      font-size: 2.3em;
      border: none;
    }

    .sequencer {

      display: none;
      width: 100%; 
      height: 100%;

      &.active {
        display: initial;
      }

      circle {

        stroke: black;
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
<template>
  <div class="container">
    <svg 
      class="sequencer"
      v-for="(n, channelIndex) in channelCount"
      :class="{
        'active': channelIndex === channel, 
      }"
      width="100%" 
      height="100%">

      <circle
        @click="addPulse"
        class="center"
        cx="200"
        cy="200"
        r="20" />

      <!-- turn this into a Step component and pass step source as a property. --> 
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
        r="20" /> 

    </svg>

    <ChannelSelector 
    :channel="channel" 
    :channel-count="channelCount" 
    v-on:channel-selector-update="updateSequenceChannel" />

    <!-- Think about what the transport does and make this into a Transport component -->
    <div class="transport">
      <button @click="startSequence" class="fas fa-play">Start</button>
      <button @click="stopSequence" class="fas fa-stop">Stop</button>
      <button @click="pauseSequence" class="fas fa-pause">Pause</button>
    </div>

    <Tempo 
    v-on:tempo-change="updateTempo" 
    :initial-tempo="tempo" />

    <Source 
    v-on:source-editor-param-change="onParamChange"
    :active="sourceEditorEnabled" 
    :source="sourceEditorSource" />

  </div>
</template>

<script>

  import { range } from '../lib/utils'
  import { 
    ER, 
    initSequence, 
    degreesToRadians, 
  } from '../lib/equations'
  import Sequencer from '../lib/Sequencer'
  import Synth from '../lib/Synth'
  import Tempo from './Tempo'
  import Source from './Source'
  import ChannelSelector from './ChannelSelector'

  export default {
    name: 'Sequencer',
    components: { 
      Tempo, 
      Source, 
      ChannelSelector 
    },
    props: {
      pulses: {
          type: Number
      },
      steps: {
        type: Number
      },
      channelCount: {
        type: Number
      },
      initialTempo: {
        type: Number
      }
    },
    data: function() {
      return {
        ui: { activeStep: -1 },
        stepEditIndex: 0,
        tempo: this.initialTempo,
        n: this.steps,
        k: this.pulses,
        sequences: this.setSequences(this.steps, this.pulses, this.channelCount),
        stepData: null,
        channel: 1
      }
    },
    created() {
      const self = this
      this.stepData = range(this.channelCount).map(channelIndex => {
        return self.calculateStepData(self.n, self.k, self.sequences[channelIndex])
      })
      this.sequencer = new Sequencer({
        channelIndex: this.channel,
        stepData: this.stepData,
        sequences: this.sequences,
        audioContext: new (window.AudioContext || AudioContext), 
        tempo: this.tempo,
        ui: this.ui,
      })
      this.sequencer.init()
      console.log(this.sequencer)
    },
    methods: {
      updateSequenceChannel(newChannel) {
        this.channel = newChannel
      },
      setSequences(n, k, sequenceCount) {
        const self = this
        return range(sequenceCount).map(_ => {
          return ER(n, k, initSequence(n, k))
        })
      },
      setSequence(n, k) {
        return ER(n, k, initSequence(n, k))
      },
      onParamChange(stepUpdate) {
        this.sequencer.updateStep(stepUpdate, this.stepEditIndex)
      },
      setEditable(index) {
        this.stepEditIndex = (index === this.stepEditIndex) ? null : index
      },
      updateTempo(newTempo) {
        this.tempo = parseInt(newTempo)
      },
      isEditable(index) {
        return index === this.stepEditIndex
      },
      isActiveStep(stepIndex, activeStep) {
        return stepIndex === activeStep || stepIndex === 0 && activeStep === -1
      },
      calculateStepData(n, k, A) {
        return range(n).map((_, index) => {
          return A[index] ? Object.assign(Synth.defaultSettings, { sourceType: 'synth' }) : null
        })
      },
      addPulse() {

        this.k = (this.k + 1 > this.n ? 0 : this.k + 1)

        this.sequences[this.channel] = ER(this.n, this.k, initSequence(this.n, this.k))
        this.stepData = this.calculateStepData(this.n, this.k, this.sequences[this.channel])

        this.sequencer.updateSequence(this.sequences[this.channel])
        this.sequencer.updateStepData(this.stepData)

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
      tempo: function(newTempo) {
        this.sequencer.updateTempo(parseInt(newTempo))
      }
    },
    computed: {
      sourceEditorEnabled() {
        return this.stepEditIndex != null &&
               this.stepEditIndex >= 0    &&
               this.stepData[this.stepEditIndex] != null
      },
      sourceEditorSource() {
        return this.stepData[this.channel] ? this.stepData[this.channel][this.stepEditIndex] : Synth.defaultSettings
      },
      circles() {

        const radius = 160
        const offsetAngle = 90
        const centerCoords = { x: 200, y: 200 }
        const sequence = this.sequences[this.channel]
        console.log('updating ?', sequence)
        const k = this.k // reactivity hack to get to update, fix this.

        return range(this.n)
          .map(step => (360/this.n) * step)
          .map((angle, index) => ({
            isPulse: sequence[index],
            cx: radius * Math.cos(degreesToRadians(angle - offsetAngle)) + centerCoords.x,
            cy: radius * Math.sin(degreesToRadians(angle - offsetAngle)) + centerCoords.y
          }))

      },
      
    }
  }

</script>

