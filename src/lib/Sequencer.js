import Tone from 'tone'
import { requiredParam, range } from './utils'
import Synth from './Synth'
import Transport from './Transport'

const defaultSettings = {
  frequency: 'C7',
  oscillator: {
    type: 'sine'
  },
  envelope: {
    attack: 0.01,
    decay: 0.4,
    sustain: 0.4,
    release: 0.2
  }
}

export default class Sequencer {

  constructor({ 

    tracks = requiredParam('tracks'),
    trackIndex = requiredParam('trackIndex'),
    ui = { activeStep: 0 }

  }) {

    this.sequencer = null
    this.tracks = tracks
    this.trackIndex = trackIndex
    this.ui = ui

  }

  init() {

    const synths = range(this.tracks.length)
      .map(_ => new Tone.Synth(defaultSettings).toMaster())
    const { sequence, stepData } = this.tracks[this.trackIndex]
    const self = this

    this.sequencer = new Tone.Sequence(function(time, stepIndex) {

      // is this the right way to sync audio/visual?
      Tone.Draw.schedule(function() {
        self.ui.activeStep = stepIndex
      }, time)

      let notesAtStep = self.tracks
        //.map(({ sequence, stepData }) => sequence[stepIndex] ? stepData[stepIndex].note : null) 
        .map(({ sequence, stepData }) => sequence[stepIndex] && stepData[stepIndex].note) 
        .filter(Boolean)

      for (let trackIndex = 0; trackIndex < self.tracks.length; trackIndex++) {

        const trackData = self.tracks[trackIndex]
        const pulseAtStep = Boolean(trackData.sequence[stepIndex])

        if (pulseAtStep) {

          const { stepData } = trackData 

          synths[trackIndex].envelope.attack = stepData[stepIndex].envelope.attack
          synths[trackIndex].envelope.decay = stepData[stepIndex].envelope.decay
          synths[trackIndex].envelope.sustain = stepData[stepIndex].envelope.sustain
          synths[trackIndex].envelope.release = stepData[stepIndex].envelope.release

          synths[trackIndex].triggerAttackRelease(stepData[stepIndex].note, '8n')

        }
      }
        // bug: notesAtStep != note at step at track
      if (notesAtStep.length) {
        for (let i = 0; i < notesAtStep.length; i++) {

        }
      }

    }, range(sequence.length), "8n").start(0.1)

  }

  updateStep(newStepData, trackIndex, stepEditIndex) {
    this.tracks[trackIndex].stepData[stepEditIndex] = newStepData
  }

  updateSequence(trackIndex, newSequence) {
    this.tracks[trackIndex].sequence = newSequence
  }

}
