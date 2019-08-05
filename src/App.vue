<template>
  <div class="euclidian-rhythms">

    <Logo />

    <Transport :tempo="tempo" v-on:tempo-updated="updateTempo"/>

    <Sequencer
    :track-count="trackCount"
    :tracks="tracks"
    :track-index="trackIndex"
    :steps="steps"
    :pulses="pulses" 
    :step-edit-index="stepEditIndex"
    v-on:step-edit-index-updated="updateStepEditIndex" />

    <TrackSelector 
    :track-index="trackIndex" 
    :track-count="trackCount" 
    v-on:track-selector-update="updateSelectedTrack" />

    <SourceEditor 
    :enabled="sourceEditorEnabled" 
    :source="soundSource"
    v-on:source-editor-note-assign="updateNoteAtStep"
    v-on:source-editor-envelope-change="updateEnvelopeAtStep" />


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
  import SourceEditor from './components/SourceEditor.vue'
  import TrackSelector from './components/TrackSelector.vue'
  import Transport from './components/Transport.vue'
  import Logo from './components/Logo'


  export default {
    name: 'app',
    components: { 
      Logo,
      Sequencer,
      SourceEditor,
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
        stepEditIndex: null,
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
      updateTransportState(newState) {
        if (newState !== this.transportState)
          this.transportState = newState
      },
      updateSelectedTrack(newTrackIndex) {
        this.trackIndex = newTrackIndex
      },
      updateStepEditIndex(newEditIndex) {
        this.stepEditIndex = (this.stepEditIndex === newEditIndex) ? null : newEditIndex
      },
      updateTempo(newTempo) {
        this.tempo = newTempo
      },

      /* these need work */
      updateNoteAtStep(newNote) {
        if (this.stepEditIndex == null)
          return
        this.tracks[this.trackIndex].stepData[this.stepEditIndex].note = newNote 
        this.stepEditIndex = this.stepEditIndex
      },
      updateEnvelopeAtStep(envelopeData) {
        if (this.stepEditIndex == null)
          return
        this.tracks[this.trackIndex].stepData[this.stepEditIndex].envelope = envelopeData
      }

    },
    computed: {
      sourceEditorEnabled() {
        const track = this.tracks[this.trackIndex]
        return this.stepEditIndex != null &&
               this.stepEditIndex >= 0    &&
               Boolean(track.sequence[this.stepEditIndex])
      },
      soundSource() {
        return this.tracks[this.trackIndex].stepData[this.stepEditIndex] || Synth.defaultSettings
      }
    }
  }

</script>

