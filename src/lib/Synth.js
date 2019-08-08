import { range } from './utils'
import Tone from 'tone'

const scale = range(8).flatMap(octave => ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'].flatMap(note => `${note}${octave}`))
const SCALE = Object.freeze(scale)

export default class Synth {

  static get defaultSettings() {

    return {
      SCALE,
      note: 'G4',
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.1,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1
      }
    }

  }

}
