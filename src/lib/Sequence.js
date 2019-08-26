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
  set n(n) {
    this._n = Math.max(n, 1)
    this._k = Math.min(this._k, this._n)
    this._sequence = ERCache[this._n][this._k]

    // adjust offset - to what? rotate(0) ?
    this.rotate(0)
  }

  get k() {
    return this._k
  }
  set k(k) {
    this._k = k
    this._sequence = ERCache[this._n][this._k]
  }

  get(index) {

    /* get sequence item post-rotation */

    if (index >= this.n || index < 0) {
      throw new Error('get(index) - array index out of bounds')
    }
    
    const { _n, _k, offset } = this
    const rotatedIndex = (offset + index) % this.n
    return this._sequence[rotatedIndex]

  }

  rotate(steps) {

    // note: +1 really rotates the sequence to the left, so flip sign of steps
    // so that +1 rotates to the right

    steps = -1 * steps 

    // normalize negative offsets to positive offsets
    let offset = this.offset + steps
    this.offset = offset < 0 ? this.n - 1
                : offset >= this.n ? 0 
                : offset
  }

}
