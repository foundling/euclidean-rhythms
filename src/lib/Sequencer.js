import Tone from 'tone'
import Scheduler from './Scheduler'
import { requiredParam, range } from './utils'

var synth = new Tone.MonoSynth().toMaster();

export default class Sequencer {
  constructor({ 
    tempo = requiredParam('tempo'),
    sequence = requiredParam('sequence'),
    ui = {}
  }) {

    this.tempo = tempo
    this.sequence = sequence
    this.ui = ui

    this.transport = Tone.Transport
    this.transport.bpm.value = this.tempo

  }
  init() {

    const subdivision = '4n'
    const self = this

    this.sequencer = new Tone.Sequence(function(time, pulseIndex) {

      if (self.sequence[pulseIndex]) {
        synth.triggerAttackRelease("C4","8n")
      }

      self.ui.activeStep = (self.ui.activeStep + 1) % self.sequence.length

    }, range(this.sequence.length), "4n")

    this.sequencer.start(0)

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
