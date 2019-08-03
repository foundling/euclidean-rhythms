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
    tracks = requiredParam('tracks'),
    trackIndex = requiredParam('trackIndex'),
    ui = { activeStep: 0 }

  }) {

    this.sequencer = null
    this.tracks = tracks
    this.trackIndex = trackIndex
    this.stepIndex = 0

    this.transport = Tone.Transport
    this.transport.bpm.value = tempo

    this.ui = ui

  }

  init() {

    const synth = new Tone.MonoSynth(defaultSettings).toMaster();
    const { sequence, stepData } = this.tracks[this.trackIndex]

    const self = this


    // need to rewrite:
    // 1. 
    // convert sequence passed into Sequence to a [0 .. n-1] range of step index
    //
    // 2.
    // use current index (where isPulse is now) in callback to loop through all track.sequences
    // for any that have a '1', loop through step data at each track at that index
    // triggerAttackRelease for each with corresponding step data

    this.sequencer = new Tone.Sequence(function(time, stepIndex) {

      console.log(stepIndex)
      let pulsesAtStep = self.tracks
        .map(({ sequence, stepData }) => sequence[stepIndex] ? stepData[stepIndex] : null) 
        .filter(Boolean)

      pulsesAtStep.forEach(stepData => {
        synth.envelope.attack = stepData.envelope.attack
        synth.envelope.decay = stepData.envelope.decay
        synth.envelope.sustain = stepData.envelope.sustain
        synth.envelope.release = stepData.envelope.release
        synth.triggerAttackRelease(stepData.note, '16n')
      })

      Tone.Draw.schedule(function() {
        // use stepIndex instead, put before pulse
        self.ui.activeStep = (self.ui.activeStep + 1) % sequence.length
      }, time)

      self.stepIndex = (self.stepIndex + 1) % sequence.length

    }, range(sequence.length), "8n").start(0)

  }



  updateEnvelope(env) {
    
  }

  updateStep(updatedStepData, editIndex) {
    // fix
    this.stepData[editIndex] = updatedStepData
  }

  updateStepData(newStepData) {
    // fix
    this.stepData = newStepData
  }

  updateSequence(trackIndex, newSequence) {
    // ????
    const { sequence } = this.tracks[trackIndex]
    for (let i = 0; i < sequence.length; ++i) {
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
