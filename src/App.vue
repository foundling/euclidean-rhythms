<template>
  <div class="euclidian-rhythms">

    <Logo />

    <Transport
    :tempo="tempo"
    v-on:tempo-updated="updateTempo"/>

    <SequencerControls 
    :pulse-mode="pulseMode"
    :step-count="steps"
    :direction="currentTrack.direction"
    :rotation="currentTrack.rotation % currentTrack.sequence.length"
    v-on:sequencer-controls-pulse-mode-updated="updatePulseMode"
    v-on:sequencer-controls-rotated="rotateTrackSequence"
    v-on:sequencer-controls-update-step-count="updateStepCount"
    v-on:sequencer-controls-direction-changed="reverseSequenceDirection" />

    <Sequencer
    :track-count="trackCount"
    :tracks="tracks"
    :track-index="trackIndex"
    :pulse-mode="pulseMode"
    :step-edit-indexes="stepEditIndexes"
    v-on:sequencer-track-pulse-count-updated="updatePulseCount"
    v-on:step-edit-index-updated="updateStepEditIndexes" />

    <TrackSelector 
    :track-index="trackIndex"
    :track-count="trackCount" 
    :muted-track-index="mutedTrackIndex"
    v-on:track-selector-track-muted="toggleTrackMute(trackIndex)"
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
    & *::selection {
      background: transparent;
    }

    @media(max-width: 500px) {
      width: 100%;
      height: 500px;
    }

  }

</style>

<script>

  import { range } from './lib/utils'
  import { ER } from './lib/equations'
  import Synth from './lib/Synth'

  import Sequencer from './components/Sequencer.vue'
  import SequencerControls from './components/SequencerControls.vue'
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
      SequencerControls,
      TrackSelector,
      Transport 
    },
    data() {
      return {
        steps: 8,
        pulses: 0,
        tempo: 240,
        trackCount: 4,
        tracks: null,
        trackIndex: 0,
        stepEditIndexes: [],
        pulseMode: '+1'
      }
    },
    created() {
      // remember to make these reactive.
      this.tracks = this.initTracks(this.trackCount, this.steps, this.pulses)
    },
    methods: {
      initTracks(trackCount, steps, pulses) {
        return range(trackCount).map(_ => {
          return {
            steps,
            pulses,
            rotation: 0,
            direction: 'clockwise',
            muted: false,
            sequence: ER(steps, pulses),
            stepData: range(steps).map(_ => Synth.defaultSettings),
          }
        })
      },
      toggleTrackMute(trackIndex) {
        this.currentTrack.muted = !this.currentTrack.muted
      },
      reverseSequenceDirection(direction) {
        this.currentTrack.direction = direction
      },
      updatePulseCount({ pulses, trackIndex }) {
        this.currentTrack.pulses = pulses
      },
      updatePulseMode(newPulseMode) {
        this.pulseMode = newPulseMode
      },
      updateStepCount(newStepCount) {
        this.currentTrack.steps = newStepCount
      },
      rotateTrackSequence(steps) {

        const { sequence, stepData } = this.currentTrack

        if (steps === 1) {
          sequence.unshift(sequence.pop())
          stepData.unshift(stepData.pop())
        } else if (steps === -1) {
          sequence.push(sequence.shift())
          stepData.push(stepData.shift())
        }

        // rotation should be negative if dir is 
        this.currentTrack.rotation = (this.currentTrack.rotation + steps) % this.currentTrack.steps 

      },
      updateSelectedTrack(newTrackIndex) {
        this.trackIndex = newTrackIndex
      },
      updateStepEditIndexes(newEditIndex, multiple) {

        const isPulse = Boolean(this.currentTrack.sequence[newEditIndex]) 
        if (!isPulse)
          return
          
        if (multiple) {
          // multiple selected, in which case we add this
          this.stepEditIndexes.push(newEditIndex)
        } else if (this.stepEditIndexes.includes(newEditIndex)) {
          // toggling single edit from on -> off
          this.stepEditIndexes = []
        } else {
          // or single toggled on
          this.stepEditIndexes = [ newEditIndex ]
        }

      },
      updateTempo(newTempo) {
        this.tempo = newTempo
      },
      updateNoteAtStep(newNote) {

        // TODO: just use a single function to replace entire step data object
        //simpler 

        // if there are multiple stepEditIndexes, take the last one clicked 
        if (!this.stepEditIndexes.length)
          return

        const lastStepEditIndex = this.stepEditIndexes[this.stepEditIndexes.length - 1]
        const self = this
        this.stepEditIndexes.forEach(i => {
          if (self.tracks[this.trackIndex].sequence[i] === 1) { 
            self.tracks[self.trackIndex].stepData[i].note = newNote
          }
        })
      },
      updateEnvelopeAtStep(envelopeData) {

        if (!this.stepEditIndexes.length)
          return

        // if there are multiple stepEditIndexes, take the last one clicked 
        const lastStepEditIndex = this.stepEditIndexes[this.stepEditIndexes.length - 1]
        this.tracks[this.trackIndex].stepData[lastStepEditIndex].envelope = envelopeData

      }

    },
    computed: {
      sequences() {

      },
      currentTrack() {
        return this.tracks[this.trackIndex]
      },
      mutedTrackIndex() {
        return this.tracks.reduce((indexOfMutedTrack, track, index) => {
          if (indexOfMutedTrack !== null)
            return indexOfMutedTrack
          else if (track.muted)
            return index
          else
            return null
        }, null)
      },
      sourceEditorEnabled() {
        const track = this.currentTrack
        return this.stepEditIndexes.length >= 0 && this.stepEditIndexes.some(i => track.sequence[i])
      },
      soundSource() {
        // if there are multiple stepEditIndexes, take the last one clicked 
        const lastStepEditIndex = this.stepEditIndexes[this.stepEditIndexes.length - 1]
        return this.currentTrack.stepData[lastStepEditIndex] || Synth.defaultSettings
      }
    }
  }

</script>
