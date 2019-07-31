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
    class="source-editor__synth-editor">

      <div class="params" 
        <div
        class="param-wrapper"
        v-for="(param, paramName) in params.envelope">
          <input 
          class="param"
          type="range" 
          :min="params.envelope[paramName].min" 
          :max="params.envelope[paramName].max" 
          :step="0.01"
          v-model.number="params.envelope[paramName].value"></input>
        </div>

        <div v-for="(param, paramName) in params.envelope">
          <label class="param-label">{{ paramName[0].toUpperCase() }}</label>
          <label class="param-label">{{ param.value }}</label>
        </div>

      </div>

    </div>

  </div>
</template>

<script>

  export default {
    name: 'SourceEditor',
    data: function() {
      return {
        soundSource: 'synthesizer',
        soundSources: ['synthesizer','audio'],
        params: {
          envelope: {
            attack: {
              value: 0.01,
              min: 0.0,
              max: 0.5,
              step: 0.01,
            },
            decay: {
              value: 0.01,
              min: 0.0,
              max: 0.5,
              step: 0.01,
            },
            sustain: {
              value: 0.01,
              min: 0.0,
              max: 0.5,
              step: 0.01,
            },
            release: {
              value: 0.01,
              min: 0.0,
              max: 0.5,
              step: 0.01,
            }
          }
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
  .source-editor {

    .source-editor__synth-editor {
      display: flex;
      height: 200px;
      width: 200px;

      .param-wrapper {
        width: 25%;
        display: flex;
        flex-direction: column;
        height: 200px;
        padding: 0;

        .param {
          width: fit-content;
          height: 50px;
          margin: 0;
          transform-origin: 100px 100px;
          transform: rotate(-90deg);
        }

        .param-label {
          display: block;
          text-align: center;
        }

      }
    }
  }
</style>
