import Tone from 'tone'
import { requiredParam, range } from './utils'
import Synth from './Synth'
import Transport from './Transport'


export default class Sequencer {

  constructor({ 

    tracks = requiredParam('tracks'),
    trackIndex = requiredParam('trackIndex'),
    ui = { activeStep: 0 },

  }) {

    this.sequencer = null
    this.trackIndex = trackIndex
    this.tracks = tracks
    this.ui = ui

  }

  init() {

    const self = this
    const synths = range(self.tracks.length)
      .map(_ => new Tone.Synth(Synth.defaultSettings).toMaster())

    self.sequencer = new Tone.Sequence(function(time, globalStepIndex) {

      const { sequence } = self.tracks[self.trackIndex]

      // is this the right way to sync audio with UI?
      Tone.Draw.schedule(function() {

        // update ui using currently visibile track's ui
        const activeTrackDirection = self.tracks[self.trackIndex].direction 
        const trackStepIndex = activeTrackDirection === 'clockwise' ? globalStepIndex : (sequence.length - globalStepIndex) % 8 
        self.ui.activeStep = trackStepIndex 

      }, time)

      for (let trackIndex = 0; trackIndex < self.tracks.length; trackIndex++) {

        if (self.tracks[trackIndex].muted)
          return

        const { sequence, stepData, direction } = self.tracks[trackIndex]
        const trackStepIndex = direction === 'clockwise' ? globalStepIndex : (sequence.length - globalStepIndex) % 8 
        const pulseAtStep = Boolean(sequence[trackStepIndex])

        if (pulseAtStep) {

          synths[trackIndex].envelope.attack = stepData[trackStepIndex].envelope.attack
          synths[trackIndex].envelope.decay = stepData[trackStepIndex].envelope.decay
          synths[trackIndex].envelope.sustain = stepData[trackStepIndex].envelope.sustain
          synths[trackIndex].envelope.release = stepData[trackStepIndex].envelope.release

          synths[trackIndex].triggerAttackRelease(stepData[trackStepIndex].note, '8n')

        }
      }

    }, range(self.tracks[self.trackIndex].sequence.length), "8n").start(0)

  }

  updateStep(newStepData, trackIndex, stepEditIndex) {
    this.tracks[trackIndex].stepData[stepEditIndex] = newStepData
  }

  updateSequence(trackIndex, newSequence) {
    this.tracks[trackIndex].sequence = newSequence
  }

}
