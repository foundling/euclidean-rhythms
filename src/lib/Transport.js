import Tone from 'tone'

export default class Transport {

  constructor({ 

    bpm = 120, 
    onStart = () => {},
    onPause = () => {}, 
    onStop  = () => {} 

  }) {

    this.transport = Tone.Transport
    this.transport.bpm.value = bpm

    this.transport.on('start', onStart)
    this.transport.on('pause', onPause)
    this.transport.on('stop', onStop)

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
