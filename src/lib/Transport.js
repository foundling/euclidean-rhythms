import Tone from 'tone'

export default {
  transport: Tone.transport,
  updateTempo() {
    this.transport
  }

}
const transport = Tone.transport
    this.transport.bpm.value = tempo


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
