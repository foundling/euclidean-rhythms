<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

  .track  {
    outline: none;
    border: none;
    box-sizing: border-box;
    height: 80px;
    width: 80px; 
    background: $gray-dark;
    color: white;
    border-radius: 2px;

    &.track {
      background: scale-color($track-1, $lightness: 80%);
    }
    &.active.track {
      background: $track-1;
    }
    &.track.muted {
      background: gray;
      color: lightgray;
    }

  }

</style>

<template>

  <button 
    @click="activateOrMute"
    :class="{ muted, active }"
     class="track">
    <slot></slot>
  </button>

</template>

<script>

  export default {
    name: 'TrackButton',
    components: {},
    props: {
      trackIndex: {
        type: Number,
        required: true
      },
      active: {
        type: Boolean, 
        default: false 
      },
      muted: {
        type: Boolean, 
        default: false 
      },
    },
    data: function() {
      return {}
    },
    computed: {
    },
    methods: {
      activateOrMute() {
        if (!this.active) {
          this.$emit('track-active-channel-updated', this.trackIndex)
        } else {
          if (this.muted)
            this.$emit('track-unmuted')
          else
            this.$emit('track-muted')
        }
      }
    }
  }

</script>

