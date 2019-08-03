<style lang="scss" scoped>

  .track-selector {
    background: whitesmoke;
    box-sizing: border-box;
    padding: 15px 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    button.track  {
      box-sizing: border-box;
      height: 80px;
      width: 80px; 
      background: rgb(80,80,80);
      color: white;
      border: none;
      border-radius: 2px;

      &.active {
        background: lightgray;
        color: gray;
      }
      &:focus {
        outline: none;
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
