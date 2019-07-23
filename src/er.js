function distribute(n, k, A) {

  let numDistributions = Math.min(k, n - k)

  for (let i = 0; i < numDistributions; i++) {
    A[i] = [ A[i] + A.pop()[0] ]
  }

  return A
}



function ER(n, k, A) {

  if ((n - k) <= 1)
    return A.join('')

  return ER(
    n - Math.min(k, n-k), 
    k > (n - k) ? n % k : k % n,
    distribute(n, k, A)
  )

}

/* Sequencer Classes */
/*

class Sequencer {

  constructor({ tempo = 120 , direction = 'right', pulseCount = 8, stepCount = 16, soundSources: [], stepsRotated = 0 }) {
    this.tempo = tempo    
    this.direction = direction
    this.pulseCount = pulseCount
    this.stepCount = stepCount
    this.soundSources = soundSources
    this.stepsRotated = stepsRotated
  }

  init() {
  }

  startSequence() {
  }

  stopSequence() {
  }

  loadSound() {
  }

  assignSoundSourceToStep() {
  }

  changeDirection() {
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
*/
