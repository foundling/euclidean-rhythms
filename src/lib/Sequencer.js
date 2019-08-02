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

export default class Sequencer {

  constructor({ 

    tempo = requiredParam('tempo'),
    sequences = requiredParam('sequences'),
    channelIndex = requiredParam('channelIndex'),
    stepData = requiredParam('stepData'),
    ui = { activeStep: 0 }

  }) {

    this.sequencer = null
    this.sequences = sequences
    this.stepData = stepData
    this.channelIndex = channelIndex
    this.stepIndex = 0

    this.transport = Tone.Transport
    this.transport.bpm.value = tempo

    this.ui = ui

  }

  init() {

    const synth = new Tone.MonoSynth(defaultSettings).toMaster();

    const self = this
    this.sequencer = new Tone.Sequence(function(time, isPulse) {

      if (isPulse) {

        const { note, envelope, oscillator } = self.stepData[this.channelIndex][self.stepIndex]
          debugger

        synth.envelope.attack =  envelope.attack
        synth.envelope.decay  =  envelope.decay
        synth.envelope.sustain = envelope.sustain
        synth.envelope.release = envelope.release

        synth.triggerAttackRelease(note, '16n')

      }

      Tone.Draw.schedule(function() {
        self.ui.activeStep = (self.ui.activeStep + 1) % self.sequences[self.channelIndex].length
      }, time)

      self.stepIndex = (self.stepIndex + 1) % self.sequences[self.channelIndex].length

    }, this.sequences[this.channelIndex], "8n").start(0)


  }

  updateEnvelope(env) {
    
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
    this.ui.activeStep = this.stepIndex = 0
  }

}
