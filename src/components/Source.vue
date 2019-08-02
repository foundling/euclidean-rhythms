<style lang="scss" scoped>
  .source-editor {
    .source-editor__synth-editor {
      display: flex;
      flex-direction: column;
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
      .params {
        display: flex;

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

      <label>Note:</label>
      <select :disabled="!active" v-model="source.note">
        <option v-for="note in source.SCALE">{{ note }}</option> 
      </select>

      <div class="params"> 
        <div
        class="param-wrapper"
        v-for="(paramValue, paramName) in source.envelope">
          <input 
          @input="onParamChange"
          :disabled="!active"
          v-model.number="source.envelope[paramName]"
          class="param"
          type="range" 
          min="0.01"
          max="1.0"
          step="0.01" />
          <label class="param-label">{{ paramName[0].toUpperCase() }}</label>
          <label class="param-label">{{ paramValue }}</label>
        </div>
      </div>
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
        soundSources: ['synthesizer','audio']
      }
    },
    methods: {
      onParamChange(e) {
        this.$emit('source-editor-param-change', this.source)
      }
    }
  }

</script>

