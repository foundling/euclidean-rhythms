import Tone from 'tone'
import { requiredParam, range } from './utils'
import Synth from './Synth'
import Transport from './Transport'

const defaultSettings = {
  frequency: 'G0',
  oscillator: {
    type: 'sine'
  },
  envelope: {
    attack: 0.5,
    decay: 0.3,
    sustain: 2,
    release: 0.5
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
    this.stepIndex = 0
    this.ui = ui

  }

  init() {

    const polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
    const { sequence, stepData } = this.tracks[this.trackIndex]
    const self = this

    this.sequencer = new Tone.Sequence(function(time, stepIndex) {

      Tone.Draw.schedule(function() {
        self.ui.activeStep = stepIndex
      }, time)

      let notesAtStep = self.tracks
        .map(({ sequence, stepData }) => sequence[stepIndex] ? stepData[stepIndex].note : null) 
        .filter(Boolean)

      if (notesAtStep.length) {
        // todo: implement envelopes
        //
        // - either create multiple mono synths, and give each the separate adsr values, OR
        // - change the way params are handled so the params are global across tracks (n params total, not (TRACKS x n) params) 
        //
        polySynth.triggerAttackRelease(notesAtStep, '16n')
      }

      self.stepIndex = (self.stepIndex + 1) % sequence.length

    }, range(sequence.length), "8n").start(0)

  }

  updateStep(newStepData, trackIndex, stepEditIndex) {
    this.tracks[trackIndex].stepData[stepEditIndex] = newStepData
  }

  updateSequence(trackIndex, newSequence) {
    this.tracks[trackIndex].sequence = newSequence
  }

}
