import Tone from 'tone'
import Scheduler from './Scheduler'
import { requiredParam, range } from './utils'

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
    ui = { activeStep: 0 }

  }) {

    this.tempo = tempo
    this.sequence = sequence
    this.sequencer = null
    this.ui = ui
    this.transport = Tone.Transport
    this.transport.bpm.value = this.tempo

  }

  init() {

    const self = this
    let index = -1
    this.sequencer = new Tone.Sequence(function(time, isPulse) {

      if (isPulse) {
        synth.triggerAttackRelease("C3", '16n')
      }

      Tone.Draw.schedule(function() {
        self.ui.activeStep = (self.ui.activeStep + 1) % self.sequence.length
      }, time)

      index = (index + 1) % self.sequence.length

    }, this.sequence, "8n").start(0)


  }

  updateSequence(newSequence) {
  }

  updateTempo(newTempo) {
    console.log(newTempo)
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
    this.ui.activeStep = -1 
  }

}
