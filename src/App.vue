<template>
  <div class="euclidian-rhythms">

    <Logo />

    <Transport 
    :tempo="tempo"
    :transport-state="transportState"
    v-on:transport-started="updateTransportState"
    v-on:transport-stopped="updateTransportState"
    v-on:transport-paused="updateTransportState"
    v-on:tempo-change="updateTempo" />

    <Sequencer 
    :track-count="trackCount"
    :initial-tempo="tempo"
    :steps="steps"
    :pulses="pulses" />

    <TrackSelector 
    :track-index="trackIndex" 
    :track-count="trackCount" 
    v-on:track-selector-update="updateSelectedTrack" />

    <Source 
    :active="sourceEditorEnabled" 
    :source="sourceEditorSource"
    v-on:source-editor-note-assign="updateStepNote"
    v-on:source-editor-param-change="updateStepData" />


  </div>
</template>

<style lang="scss">

  html, body {
    font-family: sans-serif;
  }

  .euclidian-rhythms {

    margin: 0;
    padding: 0;
    width: 400px;
    height: 400px;

    & > * { width: 100%; }

  }

</style>


<script>

  import { range } from './lib/utils'
  import { ER } from './lib/equations'
  import Synth from './lib/Synth'

  import Sequencer from './components/Sequencer.vue'
  import Source from './components/Source.vue'
  import TrackSelector from './components/TrackSelector.vue'
  import Transport from './components/Transport.vue'
  import Logo from './components/Logo'


  export default {
    name: 'app',
    components: { 
      Logo,
      Sequencer,
      Source,
      TrackSelector,
      Transport 
    },
    data() {
      return {
        tempo: 240,
        steps: 8,
        pulses: 0,
        trackCount: 4,
        tracks: null,
        trackIndex: 0,
        transportState: 'stopped'
      }
    },
    created() {
      // remember to make these reactive.
      this.tracks = this.initTracks(this.trackCount, this.steps, this.pulses)
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
      updateTempo(newTempo) {
        this.tempo = newTempo
      }, 
      updateTransportState(newState) {
        debugger
      },
      updateSelectedTrack(newTrackIndex) {
        this.trackIndex = newTrackIndex
      },
      updateStepNote(newNote) {
        const stepData = this.tracks[this.trackIndex].stepData[this.stepEditIndex] 
        stepData.note = newNote
        this.updateStepData(stepData)
      },
      updateStepData(stepUpdate) {
        this.sequencer.updateStep(stepUpdate, this.trackIndex, this.stepEditIndex)
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
      }
    },
    watch: {
      transportState(newState) {
        debugger
      }
    }
  }

</script>

