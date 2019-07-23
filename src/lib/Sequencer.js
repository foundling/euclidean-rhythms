/* ER algorithm */
function ER(n, k, A) {

  function distribute(n, k, A) {

    let numDistributions = Math.min(k, n - k)

    for (let i = 0; i < numDistributions; i++) {
      A[i] = [ A[i] + A.pop()[0] ]
    }

    return A
  }

  if ((n - k) <= 1)
    return A.join('')

  return ER(
    n - Math.min(k, n-k), 
    k > (n - k) ? n % k : k % n,
    distribute(n, k, A)
  )

}

function range(n) {
  return [...Array(n).keys()].map(Number)
}
/* Sequencer Classes */

class RequiredParam extends Error {}

const requiredParam = (name) => {
  throw new TypeError(`${name} is a required parameter`)
}

class Note {

  constructor({ 

    audioContext = requiredParam('audioContext'), 
    destNode = requiredParam('destNode'), 
    frequency = 440, 
    type = 'sine',

  }) {

    this.audioContext = audioContext
    this.destNode = destNode
    this.frequency = frequency 
    this.type = type
    this.osc = null

  }

  play() {

    this.osc = this.audioContext.createOscillator() 
    this.osc.frequency.value = this.frequency
    this.osc.type = this.type
    this.osc.connect(this.destNode)
    this.osc.start()
  }

  stop() {
    this.osc.stop()
  }

}

const DIRECTION = {
  CLOCKWISE: 'CLOCKWISE',
  COUNTER_CLOCKWISE: 'COUNTER_CLOCKWISE'
}

class Sequencer {

  constructor({ 

    audioContext = requiredParam('audioContext'),
    pulseCount = 8, 
    stepCount = 16, 
    stepsRotated = 0, 
    tempo = 120, 
    direction = DIRECTION.CLOCKWISE,
    volume = 0.09,

  }) {

    this.tempo = tempo    
    this.volume = volume
    this.direction = direction
    this.pulseCount = pulseCount
    this.stepCount = stepCount
    this.stepsRotated = stepsRotated
    this.audioContext = audioContext
    this.masterGainNode = audioContext.createGain()
    this.masterGainNode.connect(audioContext.destination)
    this.masterGainNode.gain.value = this.clampVolume(this.volume)

    this.steps = null

  }

  init() {

    this.steps = range(this.stepCount)
      .map(_ => new Note({ 
        frequency: 440, 
        audioContext: this.audioContext, 
        destNode: this.masterGainNode, 
        type: 'sine'
      }))

  }

  startSequence() {
  }

  stopSequence() {
  }

  clampVolume(v) {
    return v > 0.5 ? 0.5 : v < 0 ? 0 : v
  } 

  setVolume(newVolume) {
    this.volume  = this.clampVolume(newVolume)
  }

  changeDirection() {
    this.direction === DIRECTION.CLOCKWISE ? DIRECTION.COUNTER_CLOCKWISE : DIRECTION.CLOCKWISE
  }

  changeTempo(newTempo) {
    this.tempo = newTempo
  }

  toggleChannel(channelNumber) {
    this.channels[channelNumber] = !this.channels[channelNumber]
  }

  // +steps for right, -steps for left
  // todo: reflect sequence
  rotateSequence(steps) {
    this.stepsRotated = (this.stepsRotated + direction) % this.stepCount
  }

  increasePulses(n) {
    this.pulseCount = (this.pulseCount + n) % this.stepCount
  }

}

export default Sequencer
