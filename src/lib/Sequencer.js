import Tone from 'tone'
import Scheduler from './Scheduler'
import { requiredParam, range } from './utils'

const synth = new Tone.MonoSynth({
  frequency: 'C4',
  oscillator: {
    type: 'sine'
  },
  envelope: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.9,
    release: 1
  }
}).toMaster();


export default class Sequencer {
  constructor({ 
    tempo = requiredParam('tempo'),
    sequence = requiredParam('sequence'),
    ui = { activeStep: 0 }
  }) {

    this.tempo = tempo
    this.sequence = sequence
    this.ui = ui

    this.transport = Tone.Transport
    this.transport.bpm.value = this.tempo

  }
  init() {

    const self = this
    let index = -1
    this.sequencer = new Tone.Sequence(function(time, isPulse) {

      console.log({index})
      console.log({ activeStep: self.ui.activeStep })

      if (isPulse) {
        synth.triggerAttackRelease("C4", '8n')
      }

      Tone.Draw.schedule(function() {
        self.ui.activeStep = (self.ui.activeStep + 1) % self.sequence.length
      }, time)

      index = (index + 1) % self.sequence.length

    }, this.sequence, "8n").start(0)


  }
  updateTempo(newTempo) {
    this.transport.bpm.value = newTempo
  }
  updateSequence(newSequence) {
    //this.transport.bpm.value = newTempo
  }
  start() {
    this.transport.start()
  }
  pause() {
    this.transport.pause()
  }
  stop() {
    this.transport.stop()
    this.ui.activeStep = 0 
  }
}
