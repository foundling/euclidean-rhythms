import Tone from 'tone'
import { requiredParam, range } from './utils'
import Synth from './Synth'

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

const synth = new Tone.MonoSynth(defaultSettings).toMaster();

export default class Sequencer {

  constructor({ 

    tempo = requiredParam('tempo'),
    sequence = requiredParam('sequence'),
    stepData = requiredParam('stepData'),
    ui = { activeStep: 0 }

  }) {


    this.sequencer = null
    this.sequence = sequence
    this.stepData = stepData
    this.ui = ui
    this.transport = Tone.Transport
    this.transport.bpm.value = tempo
    this.stepIndex = 0

  }

  init() {

    const self = this
    this.sequencer = new Tone.Sequence(function(time, isPulse) {

      if (isPulse) {

        console.log(self.sequence, self.StepData)
        const { note, envelope, oscillator } = self.stepData[self.stepIndex]

        //synth.setNote = note

        synth.envelope.attack = envelope.attack
        synth.envelope.decay = envelope.decay
        synth.envelope.sustain = envelope.sustain
        synth.envelope.release = envelope.release

        synth.triggerAttackRelease(note, '16n')

      }

      Tone.Draw.schedule(function() {
        self.ui.activeStep = (self.ui.activeStep + 1) % self.sequence.length
      }, time)

      self.stepIndex = (self.stepIndex + 1) % self.sequence.length

    }, this.sequence, "8n").start(0)


  }

  updateStep(updatedStepData, editIndex) {
    this.stepData[editIndex] = updatedStepData
  }

  updateStepData(newStepData) {
    this.stepData = newStepData
  }

  updateSequence(newSequence) {
    this.sequence = newSequence
    for (let i = 0; i < newSequence.length; ++i) {
      this.sequencer.at(i, newSequence[i])
    }
  }

  updateTempo(newTempo) {
    this.transport.bpm.value = newTempo
  }

  start() {
    this.transport.start()
  }

  pause() {
    this.transport.pause()
  }

  stop() {
    this.transport.stop()
    this.ui.activeStep = this.stepIndex = -1 
  }

}
