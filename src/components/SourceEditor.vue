<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

  .source-editor {

    &:not(.enabled) {
      visibility: hidden;
    }
    opacity: 1;
    &:not(.enabled) {
      opacity: 0.5;
    }

    & > * {
      width: 100%;
    }
    .source-editor__synth-editor {
      display: flex;
      flex-direction: column;

      .notes {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        margin: 10px 0px;
        padding: 0;

        .note-names {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          .note-name {
            text-align: center;
            list-style-type: none;
            padding: 10px;
          }
        }
        .note {
          list-style-type: none;
          background: lightblue;
          margin:5px;
          padding: 10px;

          &.sharp {
            padding-top: 0px;
            background: black;
          }

          &.octave-7 {
            background: scale-color($lightblue, $lightness: 0%);
          }
          &.octave-6 {
            background: scale-color($lightblue, $lightness: 10%);
          }
          &.octave-5 {
            background: scale-color($lightblue, $lightness: 20%);
          }
          &.octave-4 {
            background: scale-color($lightblue, $lightness: 30%);
          }
          &.octave-3 {
            background: scale-color($lightblue, $lightness: 40%);
          }
          &.octave-2 {
            background: scale-color($lightblue, $lightness: 50%);
          }
          &.octave-1 {
            background: scale-color($lightblue, $lightness: 60%);
          }
          &.selected {
            background: salmon;
          }
          &.sharp {
            background: scale-color($lightblue, $lightness: 60%);
          }
        }
        .note-name {
          text-align: center;
          list-style-type: none;
        }
      }
      .param-wrapper {
        background: whitesmoke;
        padding: 25px !important;
      }

      .params {
        display: flex;

        .param-wrapper {
          width: calc(100%/4);
          display: flex;
          flex-direction: column;

          .param {
            width: 100%;
            height: 50px;
            margin: 0;
          }
          .param-label {
            display: block;
            text-align: center;
          }
        }
      }
    }
  }
</style>
<template>
  <div class="source-editor" :class="{ enabled }">
    <div class="source-editor__sound-source-selector">

      <!-- restore when audio files are supported
      <input 
      v-model="soundSource" 
      checked="true" 
      value="synthesizer" 
      type="radio">Synth</input>

      <input 
      v-model="soundSource" 
      value="audio" 
      type="radio">Audio File</input>
      -->

    </div>

    <div 
    v-show="soundSource === 'synthesizer'"
    class="source-editor__synth-editor">

      <div class="params"> 
        <div
        class="param-wrapper"
        v-for="(paramValue, paramName) in source.envelope">
          <input 
          v-model.number="source.envelope[paramName]"
          @input="updateSourceEnvelope(source.envelope)"
          :disabled="!enabled"
          class="param"
          type="range" 
          min="0.01"
          max="1.0"
          step="0.01" />
          <label class="param-label">{{ paramName }}</label>
          <label class="param-label">{{ paramValue }}</label>
        </div>
      </div>

      <ul class="notes">
        <li 
          v-for="note in source.SCALE.slice(0,12)"
          class="note-name">{{ getNoteName(note) }}</li>

        <li 
        v-for="(note, index) in notesByOctave"
        @click="assignNote(note)"
        :title="note"
        :class="{
          'sharp': note.includes('#'), 
          'selected': source.note === note,
          ['octave-' + (parseInt(note.slice(-1)[0]) + 1)]: true,
        }"
        class="note"></li>
      </ul>


    </div>

  </div>
</template>
<script>

  import Synth from '../lib/Synth'

  export default {
    name: 'SourceEditor',
    props: {
      enabled: {
        type: Boolean,
      },
      source: {
        type: Object,
        default() {
          return Synth.defaultSettings
        }
      }
    },
    data: function() {
      return {
        soundSource: 'synthesizer',
        soundSources: ['synthesizer','audio']
      }
    },
    methods: {
      getNoteName(note) {
        return note.replace(/[0-9]/,'') 
      },
      assignNote(note) {
        this.$emit('source-editor-note-assign', note)
      },
      updateSourceEnvelope(envelopeSettings) {
        this.$emit('source-editor-envelope-change', envelopeSettings)
      }
    },
    computed: {
      notesByOctave() {

        const chromaticScales = this.source.SCALE

        return [ ...Array(chromaticScales.length / 12).keys() ]
          .reduce((octaves, octave, index) => {
            const start = octave * 12,
                  end = start + 12
            octaves[index] = chromaticScales.slice(start, end)
            return octaves
          }, [])
          .reverse()
          .flat()

      }
    }
  }

</script>
