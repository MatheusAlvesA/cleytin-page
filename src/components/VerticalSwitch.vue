<template>
  <div ref="outWrapper" class="out-wrapper">
    <span class="on-label">{{ onLabel }}</span>
    <div class="switch" :class="{'on': modelValue, 'off': !modelValue}" @click="toggle">
      <div class="switch-indicator"></div>
    </div>
    <span class="off-label">{{ offLabel }}</span>
  </div>
</template>

<script>

export default {
  props: {
    modelValue: {
      Type: Boolean,
      required: false,
      default: () => false
    },
    onLabel: {
      type: String,
      required: false,
      default: () => 'Sim'
    },
    offLabel: {
      type: String,
      required: false,
      default: () => 'Não'
    },
  },
  emits: ['update:modelValue'],
  methods: {
    toggle() {
      this.$emit('update:modelValue', !this.modelValue);
    }
  },
  mounted() {}
}
</script>

<style scoped>
.out-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 60px;
  height: 200px;
}
.switch {
  width: 50px;
  height: 150px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  transition: 0.5s background-color ease;
}
.switch.on {
  background-color: rgb(168, 232, 144);
}
.switch.off {
  background-color: rgb(84, 91, 119);
}

.switch-indicator {
  width: 40px;
  height: 40px;
  margin-left: 5px;
  border-radius: 50%;
  background-color: black;
  transition: 0.5s margin-top ease, 0.5s background-color ease;
}
.switch.on .switch-indicator {
  margin-top: 5px;
  background-color: rgb(168, 232, 144);
  border: 1px solid white;
}
.switch.off .switch-indicator {
  margin-top: 105px;
  background-color: rgb(84, 91, 119);
  border: 1px solid white;
}

</style>
