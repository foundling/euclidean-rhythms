import Tone from 'tone'

export default class Transport {

  constructor({ bpm = 120 }) {
    this.transport = Tone.Transport
    this.transport.bpm.value = bpm
  }

  start() {
    this.transport.start("+0.1")
  }

  pause() {
    this.transport.pause()
  }

  stop() {
    this.transport.stop()
  }

  get tempo() {
    return this.transport.bpm.value
  }

  set tempo(bpm) {
    return this.transport.bpm.value = bpm
  }

  get state() {
    return this.transport.state
  }

}
