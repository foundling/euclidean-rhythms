import Tone from 'tone'
import { requiredParam, range } from './utils'
import Synth from './Synth'
import Transport from './Transport'

export const MAX_STEPS = 8
export const TRACK_COUNT = 4
export const PULSE_MODES = {
  '+1': (n, k) => (k + 1) > n ? 0 : k + 1,
  '-1': (n, k) => (k <= 0) ? n : k - 1,
  'random': (n, k) => Math.floor(Math.random() * n)
}

export default class Sequencer {

  constructor({ 

    tracks = requiredParam('tracks'),
    activeChannel = requiredParam('activeChannel')

  }) {

    this.sequencer = null
    this.activeChannel = activeChannel
    this.tracks = tracks

    return this
  }

  init() {

    const self = this
    const synths = range(self.tracks.length)
      .map(_ => new Tone.Synth(Synth.defaultSettings).toMaster())

    self.sequencer = new Tone.Sequence(function(time, globalStepIndex) {

      for (let trackIndex = 0; trackIndex < self.tracks.length; trackIndex++) {

        const { sequence, stepData } = self.tracks[trackIndex]

        const pulseAtStep = sequence.advance()

        if (trackIndex === 0) {
          console.log(`sequence 0. n: ${ sequence.n }, k: ${ sequence.k }, rotation: ${sequence.offset}`)
        }

        if (!sequence.muted && pulseAtStep) {

          synths[trackIndex].envelope.attack = stepData[sequence.activeStep].envelope.attack
          synths[trackIndex].envelope.decay = stepData[sequence.activeStep].envelope.decay
          synths[trackIndex].envelope.sustain = stepData[sequence.activeStep].envelope.sustain
          synths[trackIndex].envelope.release = stepData[sequence.activeStep].envelope.release

          synths[trackIndex].triggerAttackRelease(stepData[sequence.activeStep].note, '8n')

        }

      }

      // todo: sync ui with active step
      Tone.Draw.schedule(function() {
        const { sequence } = self.tracks[self.activeChannel]
      }, time)

    }, range(MAX_STEPS), "8n").start('+0.1')

    return this

  }

  updateStep(newStepData, trackIndex, stepEditIndex) {
    this.tracks[trackIndex].stepData[stepEditIndex] = newStepData
  }

  updateSequence(trackIndex, newSequence) {
    this.tracks[trackIndex].sequence = newSequence
  }

}
