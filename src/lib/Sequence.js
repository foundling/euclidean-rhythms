import { ER } from '@/lib/equations'
import { requiredParam } from '@/lib/utils'

const MIN_N = 1
const MAX_N = 16
const MIN_K = 0
const MAX_K = 16


const ERCache = []
for (let n = MIN_N; n <= MAX_N; n++) {
	for (let k = MIN_K; k <= n; k++) {
		if (ERCache[n])
			ERCache[n][k] = ER(n,k)
		else
			ERCache[n] = [ ER(n,k) ]
	}
}

export default class Sequence {

  constructor({ 

    n = steps,
    k = pulses,
    offset = 0,
    direction = 'clockwise',
    stepData = requiredParam('stepData is a required param'),
    muted = false,  
    activeStep = -1

  }) {
  
    this._n = n
    this._k = k
    this.activeStep = activeStep
    this.offset = offset
    this.offsetMagnitude = this.offset >= 0 ? 1 : -1
    this.direction = direction
    this.magnitude = this.direction === 'clockwise' ? 1 : -1
    this.muted = muted
    this._sequence = ERCache[this._n][this._k]
    this.stepData = stepData // TODO: convert to getter 

  }

  advance() {

    this.activeStep = this.direction === 'clockwise' ? this.activeStep + 1 : this.activeStep - 1

    if (this.activeStep >= this.n) {
      this.activeStep = 0
    } else if (this.activeStep < 0) {
      this.activeStep = this.n - 1
    }

    return this.get(this.activeStep)

  }

  /* update sequence when n and k are updated */
  get n() {
    return this._n
  }
  set n(n) {

    // adjust k and offset so they're still in bounds of n.  

    this._n = Math.max(n, 1)
    this._k = Math.min(this._k, this._n)
    this._sequence = ERCache[this._n][this._k]

    // TODO: might need to set rotation to min(n - 1,offset)
    this.rotate(0)
  }

  get k() {
    return this._k
  }

  set k(k) {
    this._k = k
    this._sequence = ERCache[this._n][this._k]
  }

  getStepDataAt(index) {
    /* get stepData item post-rotation */
    return this.stepData[this.getRotatedIndex(index)]
  }

  setStepDataAt(index, obj) {
    const rotatedIndex = this.getRotatedIndex(index) 
    this.stepData[rotatedIndex] = obj
  }

  get(index) {

    /* get sequence item post-rotation */
    return this._sequence[this.getRotatedIndex(index)]

  }

  getRotatedIndex(index) {

    const { _n, _k, offset } = this

    // convert to a positive index for array access in bounds, accounting for offset
    const rotatedIndex = offset < 0 ? (this._n - Math.abs(offset) + index) % this._n
                       : (offset + index) % this._n

    return rotatedIndex
  }

  rotate(steps) {
    this.offset = (steps + this.offset) % this.n
    console.log('rotation: ', this._sequence, this.stepData)
  }

}
