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

    button.track  {
      border: none;
      box-sizing: border-box;
      height: 80px;
      width: 80px; 
      background: $gray-dark;
      color: white;
      border-radius: 2px;

      &.active.track-1 {
        background: $track-1;
      }
      &.active.track-2 {
        background: $track-2;
      }
      &.active.track-3 {
        background: $track-3;
      }
      &.active.track-4 {
        background: $track-4;
      }
      &.active {
        color: gray;
      }

    }

  }

</style>

<template>
  <div class="track-selector">
    <button 
      class="track"
      v-for="(v,i) in trackCount"
      :class="{
        ['track-'+ v]: true,
        'active': isActiveTrack(i)
      }"
      @click="selectTrack(i)">{{ v }}</button>
  </div>
</template>

<script>

  export default {
    name: 'TrackSelector',
    props: {
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
      selectTrack(newTrackIndex) {
        if (newTrackIndex === this.index)
          return
        this.index = newTrackIndex 
        this.$emit('track-selector-update', this.index)
      },
      isActiveTrack(index) {
        return index === this.index
      }
    }
  }

</script>
