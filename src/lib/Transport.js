import Tone from 'tone'

export default class Transport {

  constructor() {
    this.transport = Tone.Transport
  }

  start() {
    this.transport.start()
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
