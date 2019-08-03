<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

  .source-editor {

    opacity: 1;
    &:not(.active) {
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
        grid-column-gap: 10px;
        grid-row-gap: 10px;
        margin: 0;
        padding: 0;

        .note {
          list-style-type: none;
          border-radius: 20px;
          background: lightblue;
          padding: 10px;

          &.selected {
            background: salmon;
          }
        }
        .note-name {
          list-style-type: none;
        }
      }
      .param-wrapper:nth-child(1) {
        background: $track-1;
      }
      .param-wrapper:nth-child(2) {
        background: $track-2;
      }
      .param-wrapper:nth-child(3) {

        background: $track-3;
      }
      .param-wrapper:nth-child(4) {
        background: $track-4;
      }

      .params {
        display: flex;

        .param-wrapper {
          padding: 5px;
          width: calc(100%/4);
          display: flex;
          flex-direction: column;
          padding: 5px;

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
  <div class="source-editor" :class="{ active }">
    <div class="source-editor__sound-source-selector">

      <!--
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

      <!--
      <label>Note:</label>
      <select :disabled="!active" v-model="source.note">
        <option v-for="note in source.SCALE">{{ note }}</option> 
      </select>
      -->

      <ul class="notes">
        <li class="note-name" :title="note" v-for="note in source.SCALE.slice(0,12)">{{note}}</li>
      </ul>

      <ul class="notes">
        <li 
        v-for="note in source.SCALE"
        @click="assignNote(note)"
        :title="note"
        :class="{
          'selected': source.note === note
        }"
        class="note"></li>
      </ul>

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
      assignNote(note) {
        this.$emit('source-editor-note-assign', note)
      },
      onParamChange(e) {
        this.$emit('source-editor-param-change', this.source)
      }
    }
  }

</script>

