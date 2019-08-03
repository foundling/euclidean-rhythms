<style lang="scss" scoped>

  .container {

    margin: 0;
    padding: 0;
    width: 400px;
    height: 400px;

    .transport > button {
      font-size: 2.3em;
      border: none;
      width: calc(100%/3) - 10px;

      background: transparent;
        padding: 10px;
    }

    .sequencer {

      background: lightgray;
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
<!-- Think about what the transport does and make this into a Transport component -->
    <div class="transport">
      <button @click="startSequence" class="fas fa-play"></button>
      <button @click="stopSequence" class="fas fa-stop"></button>
      <button @click="pauseSequence" class="fas fa-pause"></button>
    </div>


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

    <TrackSelector 
    :track-index="trackIndex" 
    :track-count="trackCount" 
    v-on:track-selector-update="updateSelectedTrack" />

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
  import { ER, degreesToRadians } from '../lib/equations'
  import Sequencer from '../lib/Sequencer'
  import Synth from '../lib/Synth'
  import Tempo from './Tempo'
  import Source from './Source'
  import TrackSelector from './TrackSelector'

  export default {
    name: 'Sequencer',
    components: { 
      Tempo, 
      Source, 
      TrackSelector 
    },
    props: {
      pulses: {
          type: Number
      },
      steps: {
        type: Number
      },
      trackCount: {
        type: Number
      },
      initialTempo: {
        type: Number
      }
    },
    data: function() {
      return {
        n: this.steps,
        k: this.pulses,
        trackIndex: 0,
        tracks: this.initTracks(this.trackCount, this.steps, this.pulses),
        ui: { activeStep: -1 },
        stepEditIndex: 0,
        tempo: this.initialTempo,
      }
    },
    created() {
      this.sequencer = new Sequencer({
        tempo: this.tempo,
        ui: this.ui,
        audioContext: new (window.AudioContext || AudioContext), 
        tracks: this.tracks,
        trackIndex: this.trackIndex,
      })
      this.sequencer.init()
    },
    methods: {
      initTracks(trackCount, n, k) {
        return range(trackCount).map(_ => {
          return {
            n,
            k,
            sequence: ER(n, k),
            stepData: range(n).map(_ => Synth.defaultSettings)
          }
        })
      },
      updateSelectedTrack(newTrackIndex) {
        this.trackIndex = newTrackIndex
      },
      setSequences(n, k, sequenceCount) {
        return range(sequenceCount).map(_ => {
          return ER(n, k)
        })
      },
      setSequence(n, k) {
        return ER(n, k)
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
        // increases k for this track
        // re-runs ER for n,k

        const track = this.tracks[this.trackIndex] 
        track.k = (track.k + 1 > track.n) ? 0 : track.k + 1

        track.sequence = ER(track.n, track.k)
        this.stepData = this.calculateStepData(track.n, track.k, track.sequence)

        this.sequencer.updateSequence(this.trackIndex, track.sequence)
        //this.sequencer.updateStepData(trackIndex, track.stepData)

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
      },
      trackIndex: function(newTrackIndex) {

      }
    },
    computed: {
      sourceEditorEnabled() {
        const track = this.tracks[this.trackIndex]
        return this.stepEditIndex != null &&
               this.stepEditIndex >= 0    &&
               Boolean(track.sequence[this.stepEditIndex])
      },
      sourceEditorSource() {
        return this.tracks[this.trackIndex].stepData[this.stepEditIndex]
      },
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

