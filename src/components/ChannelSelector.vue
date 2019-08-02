<style lang="scss" scoped>

  .channel-selector {
    background: whitesmoke;
    box-sizing: border-box;
    padding: 15px 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    button.channel {
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
  <div class="channel-selector">
    <button 
      class="channel"
      :class="{
        'active': isActiveChannel(index)
      }"
      v-for="(v,index) in channelCount"
      @click="selectChannel(index)">{{ v }}</button>
  </div>
</template>

<script>

  export default {
    name: 'ChannelSelector',
    props: {
      channelCount: {
        type: Number
      },
      channel: {
        type: Number
      }
    },
    data: function() {
      return {
        channelIndex: this.channel
      }
    },
    methods: {
      selectChannel(index) {

        if (index === this.channelIndex)
          return

        this.channelIndex = index
        this.$emit('channel-selector-update', this.channelIndex)

      },
      isActiveChannel(index) {
        return index === this.channelIndex
      }
    }
  }

</script>

