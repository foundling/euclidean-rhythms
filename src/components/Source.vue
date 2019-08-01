<style lang="scss" scoped>
  .source-editor {
    .source-editor__synth-editor {
      display: flex;
      width: 200px;
      .param-wrapper:nth-child(1) {
        background: aqua;
      }
      .param-wrapper:nth-child(2) {
        background: yellow;
      }
      .param-wrapper:nth-child(3) {
        background: lightgray;
      }
      .param-wrapper:nth-child(4) {
        background: coral;
      }

      &:not(.active) {
        > .param-wrapper {
          background: lightgray;
          color: gray;
        }
      }
      .param-wrapper {
        display: flex;
        flex-direction: column;
        padding: 20px;
        .param {
          width: fit-content;
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
</style>
<template>
  <div class="source-editor">
    <div class="source-editor__sound-source-selector">

      <input 
      v-model="soundSource" 
      checked="true" 
      value="synthesizer" 
      type="radio">Synth</input>

      <input 
      v-model="soundSource" 
      value="audio" 
      type="radio">Audio File</input>

    </div>

    <div 
    v-show="soundSource === 'synthesizer'"
    :class="{'active': active }"
    class="source-editor__synth-editor">

      <div class="params" 
        <div
        class="param-wrapper"
        v-for="(paramValue, paramName) in params.envelope">
          <input 
          :disabled="!active"
          v-model.number="params.envelope[paramName]"
          class="param"
          type="range" 
          min="0.0"
          max="1.0"
          step="0.01" />
          <label class="param-label">{{ paramName[0].toUpperCase() }}</label>
          <label class="param-label">{{ paramValue }}</label>
        </div>
      </div>

      <pre>{{ JSON.stringify(source, null, 4) }}</pre>
    </div>

  </div>
</template>
<script>

  // stick to one goal here: editing pre-existing data, emitting updates
  import Synth from '../lib/Synth'

  export default {
    name: 'SourceEditor',
    props: {
      active: {
        type: Boolean,
      },
      source: {
        type: Object,
        default: function() { return Synth.defaultSettings },
      }
    },
    data: function() {
      return {
        soundSource: 'synthesizer',
        soundSources: ['synthesizer','audio'],
        stepData: null, // Synth.defaultSettings
        stepDataIndex: -1,
        // source.settings instead
        params: {
          envelope: {
            attack:   0.04,
            decay:    0.01,
            sustain:  0.01,
            release:  0.01
          }
        }
      }
    }
  }

</script>

