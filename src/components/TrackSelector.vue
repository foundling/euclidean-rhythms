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

  }

</style>

<template>
  <div class="track-selector">
    <button 
      v-for="(v,i) in trackCount"
      :class="{
        ['track-'+ v]: true,
        'muted': isMuted(i),
        'active': isActiveTrack(i),
      }"
      @click="selectOrMuteTrack(i)"
      class="track">{{ v }}</button>
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
    data: function() {
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
