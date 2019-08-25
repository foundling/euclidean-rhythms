import { ER } from '@/lib/equations'

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
    stepData = [],
    muted = false,  

  }) {
  
    this._n = n
    this._k = k
    this.offset = offset
    this.direction = direction
    this.magnitude = this.direction === 'clockwise' ? 1 : -1
    this.muted = muted
    this._sequence = ERCache[this._n][this._k]

  }

  /* update sequence when n and k are updated */
  get n() {
    return this._n
  }
  set n(newN) {
    this._n = newN
    this._sequence = ERCache[this._n][this._k]
  }

  get k() {
    return this._k
  }
  set k(newK) {
    this._k = newK
    this._sequence = ERCache[this._n][this._k]
  }

  get(index) {

    /* return index at rotated sequence, checking bounds */

    if (index >= this.n || index < 0) {
      throw new Error('get(index) - array index out of bounds')
    }
    
    const { _n, _k, offset } = this

    // so we can more easily calculate the get index post-offset
    const safeIndex = this.positiveOffset % _n 
    return this._sequence[safeIndex]

  }

  toPositiveOffset(offset, length) {
    return offset < 0 ? length + offset : offset % length
  }

  get positiveOffset() {
    return this.toPositiveOffset(this.offset, this._n)
  }

  rotate(steps) {
    // +n = rotate clockwise
    // -n = rotate counterclockwise
    //
    // todo: make sure this wraps appropriately
    this.offset = this.toPositiveOffset(this.offset + steps, this._n)
  }

}
