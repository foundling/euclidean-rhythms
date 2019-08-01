export default class Synth {

  constructor() {

  }

  static get defaultSettings() {

    return {
      frequency: 'C2',
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
