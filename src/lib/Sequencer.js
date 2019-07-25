import Tone from 'tone'
import Scheduler from './Scheduler'
import { requiredParam, range } from './utils'


var synth = new Tone.MonoSynth({
    "oscillator" : {
        "type" : "sine"
    },
    "envelope" : {
        "attack" : 0.1,
        "decay" : 0.5,
        "sustain" : 0.5,
        "release" : 0.5,
    }
}).toMaster();

export default class Sequencer {

  constructor({ tempo = 120, steps = 8, distributedPulses = {}, ui = {} }) {
    this.tempo = tempo
    this.steps = steps
    this.transport = Tone.Transport
    this.stopped = false
    this.started = false
    this.paused = false
    this.ui = ui
    this.distributedPulses = distributedPulses
  }

  init() {

    const steps = range(this.steps)
    const pulses = this.distributedPulses
    const subdivision = '4n'
    const self = this

    const sequence = new Tone.Sequence(function(time, step) {

      // pulses not updating like they would in vue
      if (pulses[step])
        synth.triggerAttackRelease("C4","8n")

      self.ui.activeStep = step

    }, steps, "4n")

    sequence.start(0)

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
