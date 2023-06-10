<template>
  <div ref="outWrapper" class="out-wrapper" :class="{'disabled': disabled}">
    <input ref="input" class="hidden-input" type="color" :value="parsedColor" @change="parsedColor = $event.target.value" />
    <div class="wrapper" :style="{'background-color': parsedColor}"></div>
  </div>
</template>

<script>
import { colorObjectToString } from '../utils.js';

export default {
  props: {
    modelValue: {
      type: Object,
      required: true,
      default: () => ({r: 255, g: 255, b: 255})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  computed: {
    parsedColor: {
      get() {
        return colorObjectToString(this.modelValue);
      },
      set(value) {
        this.$emit('update:modelValue', {r: parseInt(value.slice(1, 3), 16), g: parseInt(value.slice(3, 5), 16), b: parseInt(value.slice(5, 7), 16)});
      }
    }
  },
  mounted() {
    this.$refs.outWrapper.addEventListener('click', () => {
      if (this.disabled) return;
      this.$refs.input.click();
    });
  }
}
</script>

<style scoped>
.out-wrapper.disabled {
  pointer-events: none;
}
.wrapper {
  display: inline-block;
  width: 150px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.out-wrapper.disabled .wrapper {
  cursor: default;
}

.hidden-input {
  width: 0px;
  height: 0px;
  border: none;
  padding: 0px;
  visibility: hidden;
}
</style>
