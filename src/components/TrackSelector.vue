<style lang="scss" scoped>

  @import "../assets/scss/colors.scss";

  .track-selector {
    background: $gray-light;
    box-sizing: border-box;
    padding: 15px 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

  }

</style>

<template>
  <div class="track-selector">
    <slot></slot>
  </div>
</template>

<script>

  export default {
    name: 'TrackSelector',
    props: {
      mutedTrackIndex: {
        type: Number
      },
      trackCount: {
        type: Number
      },
      trackIndex: {
        type: Number
      }
    },
    data() {
      return {
        index: this.trackIndex
      }
    },
    methods: {
      selectOrMuteTrack(trackIndex) {
        if (trackIndex === this.index) {
          this.$emit('track-selector-track-muted', this.index)
        } else {
          this.index = trackIndex 
          this.$emit('track-selector-update', this.index)
        }
      },
      isActiveTrack(index) {
        return index === this.index
      },
      isMuted(index) {
        return index === this.mutedTrackIndex
      }
    }
  }

</script>
