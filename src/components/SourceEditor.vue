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
      Synth
    </div>

    <div
      v-show="soundSource === 'audio'"
      class="source-editor__audio-editor">
      Audio
    </div>

  </div>
</template>

<script>

  export default {
    name: 'SourceEditor',
    components: {
    },
    props: {
    },
    data: function() {
      return {
        soundSource: 'synthesizer',
        soundSources: ['synthesizer','audio']
      }
    },
    created() {
    },
    methods: {
    },
    watch: {
    },
    computed: {
    }
  }

</script>

<style lang="scss" scoped>
  .source-editor {
  }
</style>
