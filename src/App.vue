<template>
  <div class="euclidian-rhythms">

    <Logo />

    <Transport
    :tempo="tempo"
    v-on:transport-stopped="resetActiveSteps"
    v-on:transport-tempo-updated="updateTempo" />

    <SequencerControls :active-channel="activeChannel">

      <StepCount 
      :step-count="currentTrack.sequence.n" 
      v-on:step-count-updated="updateStepCount" />

      <PulseMode 
      pulse-mode="pulseMode" 
      :pulse-modes="pulseModes" 
      v-on:pulse-mode-updated="updatePulseMode" />

      <Rotation
      :steps-rotated="currentTrack.sequence.offset" 
      :rotation-magnitude="currentTrack.sequence.offsetMagnitude"
      v-on:rotation-updated="updateTrackRotation" />

      <Direction
      :direction="currentTrack.sequence.direction"
      v-on:direction-updated="updateTrackDirection" />

    </SequencerControls>

    <Sequencer
    :tracks="tracks"
    :pulse-mode="pulseMode"
    :active-channel="activeChannel"
    :steps-in-edit-mode="stepsInEditMode"
    v-on:sequencer-step-edit-index-update="updateStepEditIndexes"
    v-on:pulse-count-updated="updatePulseCount" />

    <TrackSelector>
      <TrackButton 
      v-for="(track, index) in tracks" 
      :active="activeChannel === index"
      :muted="track.sequence.muted"
      :track-index="index"
      v-on:track-unmuted="track.sequence.muted = false"
      v-on:track-muted="track.sequence.muted = true"
      v-on:track-active-channel-updated="activeChannel = index" >
        <span>{{ index + 1 }}</span>
      </TrackButton>
    </TrackSelector>

    <SourceEditor 
    :enabled="sourceEditorEnabled" 
    :source="soundSource"
    v-on:source-editor-note-assign="updateStepData"
    v-on:source-editor-envelope-change="updateStepData" />

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

  import { range, jsonClone } from './lib/utils'
  import { ER } from './lib/equations'
  import Synth from './lib/Synth'
  import Sequence from './lib/Sequence'
  import { PULSE_MODES, TRACK_COUNT, MAX_STEPS } from './lib/Sequencer'

  import PulseMode from './components/PulseMode'
  import Rotation from './components/Rotation'
  import StepCount from './components/StepCount'
  import Direction from './components/Direction'
  import Sequencer from './components/Sequencer'
  import SequencerControls from './components/SequencerControls'
  import SourceEditor from './components/SourceEditor'
  import TrackSelector from './components/TrackSelector'
  import TrackButton from './components/TrackButton'
  import Transport from './components/Transport'
  import Logo from './components/Logo'

  export default {
    name: 'app',
    components: { 
      Direction,
      Logo,
      PulseMode,
      Rotation,
      Sequencer,
      SequencerControls,
      SourceEditor,
      StepCount,
      TrackButton,
      TrackSelector,
      Transport, 
    },
    data() {
      return {
        tempo: 100,
        trackCount: 4,
        activeChannel: 0,
        tracks: null,
        stepsInEditMode: [],
        pulseMode: Object.keys(PULSE_MODES)[0],
        pulseModes: PULSE_MODES,
      }
    },
    created() {
      // once the data is stored in local storage
      // merge that data with this.tracks here
      this.tracks = this.initTracks(TRACK_COUNT, MAX_STEPS, 0)

    },
    computed: {
      currentTrack() {
        return this.tracks[this.activeChannel]
      },
      mutedTrackIndex() {
        return this.tracks.reduce((indexOfMutedTrack, track, index) => {
          if (indexOfMutedTrack != null)
            return indexOfMutedTrack
          else if (track.sequence.muted)
            return index
          else
            return null
        }, null)
      },
      sourceEditorEnabled() {
        return this.stepsInEditMode.length >= 0 && this.stepsInEditMode.some(index => this.currentTrack.sequence.get(index))
      },
      soundSource() {
        // TODO: fix, not working with multiple
        // if there are multiple stepsInEditMode, take the last one clicked 
        const lastStepEditIndex = this.stepsInEditMode[this.stepsInEditMode.length - 1]
        return this.currentTrack.sequence.getStepDataAt(lastStepEditIndex) || Synth.defaultSettings
      }
    },
    methods: {
      initTracks(trackCount, steps, pulses) {
        // does this need to be defined here? not vue-specific.
        return range(trackCount).map((_, index) => {
          return {
            pulseMode: Object.keys(PULSE_MODES)[0],
            sequence: new Sequence({ 
              stepData: range(steps).map(_ => Synth.defaultSettings),
              activeStep: -1,
              n: steps,
              k: pulses,
              direction: 'clockwise',
              offset: 0,
              muted: false,
            })
          }
        })
      },
      updateTrackRotation(rotationSteps) {
        this.tracks[this.activeChannel].sequence.rotate(rotationSteps)
      },
      updateTrackDirection(direction) {
        /* use sequence object now */
        if (direction !== this.tracks[this.activeChannel].sequence.direction) 
          this.tracks[this.activeChannel].sequence.direction = direction
      },
      updateActiveChannel(channelIndex) {
        this.activeChannel = channelIndex
      },
      updatePulseMode(newPulseMode) {
        this.pulseMode = newPulseMode
      },
      resetActiveSteps() {
        this.tracks.forEach(t => {
          t.sequence.activeStep = -1
        })
      },
      updatePulseCount({ pulseMode, activeChannel }) {
        const { n, k } = this.tracks[activeChannel].sequence
        const newK = PULSE_MODES[this.pulseMode](n, k)
        this.tracks[activeChannel].sequence.k = newK
        this.stepsInEditMode.length = 0
      },
      updateStepCount(newStepCount) {

        /* means step counts can vary by track */
        const sequence = this.tracks[this.activeChannel].sequence
        if (newStepCount > MAX_STEPS)
          return

        sequence.n = newStepCount

      },
      updateStepEditIndexes(newEditIndex, multiple) {

        const isPulse = Boolean(this.currentTrack.sequence.get(newEditIndex)) 
        if (!isPulse)
          return
          
        if (multiple) {
          // multiple selected, including this step.  unselect them all.
          if (this.stepsInEditMode.includes(newEditIndex)) {
            this.stepsInEditMode = [] 
          } else {
            // multiple selected, but this is not yet selected, so we add it.
            this.stepsInEditMode.push(newEditIndex)
          }
        } else {
          if (this.stepsInEditMode.length > 1) {
            // toggle from previous multiple select to just a single step
            this.stepsInEditMode = [newEditIndex]
          } else if (this.stepsInEditMode.includes(newEditIndex)) {
            // toggling single step edit view off
            this.stepsInEditMode = [] 
          } else {
            // toggling single step edit view on
            this.stepsInEditMode = [newEditIndex]
          }
        }

      },
      updateTempo(newTempo) {
        this.tempo = newTempo
      },


      updateStepData({ param, value }) {

        // TODO: additional updates before transitioning away from multiselect fail

        const { activeChannel, tracks, stepsInEditMode } = this
        const multipleNotesSelected = stepsInEditMode.length > 1
        const lastStepEditIndex = stepsInEditMode[stepsInEditMode.length - 1]

        if (multipleNotesSelected) {

          // update selected step, then copy settings to other steps
          const sourceStepData = tracks[activeChannel].sequence.stepData[lastStepEditIndex]
          sourceStepData[param] = value

          stepsInEditMode.forEach((stepEditIndex, index, array) => {
            if (stepEditIndex === lastStepEditIndex) return
            const clonedStep = jsonClone(sourceStepData)
            tracks[activeChannel].sequence.setStepDataAt(stepEditIndex, clonedStep)
          })

        } else {
          // FIXME: when doing a note change after a group value change, 
          // the note value IS being changed but the UI isn't getting updated until next tick
          // something about the multi-select and the update in the source editor ?

          const [ index ] = stepsInEditMode
          const sourceStepData = tracks[activeChannel].sequence.stepData[lastStepEditIndex]
          sourceStepData[param] = value
          tracks[activeChannel].sequence.setStepDataAt(index, sourceStepData)
        }

      },
      updateEnvelopeAtStep(envelopeData) {

        if (!this.stepsInEditMode.length)
          return

        // if there are multiple stepsInEditMode, take the last one clicked 
        const lastStepEditIndex = this.stepsInEditMode[this.stepsInEditMode.length - 1]
        this.tracks[this.activeChannel].sequence.stepData[lastStepEditIndex].envelope = envelopeData

      }


    }
  }

</script>
