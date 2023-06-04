<template>
  <div class="wrapper" :style="{'background-color': parsedColor}"></div>
</template>

<script>
import { colorObjectToString } from '../utils.js';

export default {
  props: {
    modelValue: {
      type: Object,
      required: true,
      default: () => ({r: 255, g: 255, b: 255})
    }
  },
  emits: ['update:modelValue'],
  computed: {
    parsedColor() {
      return colorObjectToString(this.modelValue);
    }
  },
  mounted() {}
}
</script>

<style scoped>
.wrapper {
  display: inline-block;
  width: 150px;
  height: 30px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
