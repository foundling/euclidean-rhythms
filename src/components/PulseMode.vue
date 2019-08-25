<style lang="scss" scoped>
</style>

<template>
  <label>
    <span>Pulse Mode: </span> 
    <select @change="$emit('pulse-mode-updated', $event.target.value)">
      <option
      v-for="(mode, name) in pulseModes"
      :selected="pulseMode === mode">{{ name }}</option>
    </select>
  </label>
</template>

<script>

  export default {
    name: 'PulseMode',
    components: {},
    props: {
      pulseMode: String,
      pulseModes: Object
    },
    data: function() {
      return {}
    },
    computed: {
    },
    methods: {
    }
  }

</script>

