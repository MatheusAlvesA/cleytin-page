<template>
  <div>
    <div class="d-flex flex-column justify-content-center align-items-center mb-3" oncontextmenu="return false;">
      <div
        v-for="(pixelRow, rowIndex) in pixelsBySize"
        :key="rowIndex"
        class="d-flex flex-row justify-content-center align-items-center"
      >
        <div
          v-for="(pixel, columnIndex) in pixelRow"
          :key="columnIndex"
          class="pixel"
          :class="{'no-border': !borders, 'last-row': rowIndex === heightProxy - 1}"
          :style="{
            width: `${10*zoom}px`,
            height: `${10*zoom}px`,
            backgroundColor: colorToString(colorMode ? pixel : pixelMonochromeColor(pixel))
          }"
          @mouseover="mouseOverPixel(rowIndex, columnIndex)"
          draggable="false"
        ></div>
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto">
        <label for="inputWidth" class="col-form-label">Largura:</label>
      </div>
      <div class="col-auto">
        <input v-model="widthProxy" type="number" id="inputWidth" class="form-control number" style="width: 80px;">
      </div>
      <div class="col-auto">
        <label for="inputHeight" class="col-form-label">Altura:</label>
      </div>
      <div class="col-auto">
        <input v-model="heightProxy" type="number" id="inputHeight" class="form-control number" style="width: 80px;">
      </div>
      <div class="col-auto ms-5 me-5">
        <font-awesome-icon icon="fa-solid fa-minus" style="cursor: pointer;" @click="zoomOut" />
        <span style="font-size: 18px;">&nbsp;&nbsp;{{zoom}}x&nbsp;&nbsp;</span>
        <font-awesome-icon icon="fa-solid fa-plus"  style="cursor: pointer;" @click="zoomIn" />
      </div>
      <div class="col-auto">
        <input type="checkbox" class="form-check-input" id="borderCheck" :checked="borders" @change="borders = $event.target.checked">
        <label class="form-check-label" for="borderCheck">&nbsp;Bordas</label>
      </div>
    </div>
  </div>
</template>

<script>
import { color888To565, colorObjectToString } from '@/utils.js';

export default {
  props: {
    pixels: {
      type: Array,
      required: true
    },
    colorSelected: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    colorMode: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:width', 'update:height', 'setPixel', 'unsetPixel'],
  methods: {
    colorToString(color) {
      const color565 = color888To565(color);
      return colorObjectToString(color565);
    },
    pixelMonochromeColor(pixel) {
      if(pixel.r !== 255 || pixel.g !== 255 || pixel.b !== 255) {
        // Se o pixel tiver uma conr diferente de branco, retorna a cor selecionada
        return this.colorSelected
      }
      return pixel;
    },
    mouseOverPixel(i, j) {
      if(this.mbl) {
        this.$emit('setPixel', {i, j});
      }
      if(this.mbr) {
        this.$emit('unsetPixel', {i, j});
      }
    },
    handleMouseDown(event) {
      if(event.button === 0) {
        this.mbl = true;
      }
      if(event.button === 2) {
        this.mbr = true;
      }
    },
    handleMouseUp(event) {
      if(event.button === 0) {
        this.mbl = false;
      }
      if(event.button === 2) {
        this.mbr = false;
      }
    },
    zoomIn() {
      let r = this.zoom + 0.1;
      this.zoom = (Math.round(r * 10) / 10);
    },
    zoomOut() {
      const r = this.zoom - 0.1;
      if(r > 0.4) {
        this.zoom = (Math.round(r * 10) / 10);
      }
    }
  },
  computed: {
    widthProxy: {
      get() {
        return this.width;
      },
      set(value) {
        this.$emit('update:width', value);
      }
    },
    heightProxy: {
      get() {
        return this.height;
      },
      set(value) {
        this.$emit('update:height', value);
      }
    },
    pixelsBySize() {
      const pixels = [];
      for (let i = 0; i < this.height; i++) {
        pixels.push([]);
        for (let j = 0; j < this.width; j++) {
          pixels[i].push(this.pixels[i][j]);
        }
      }
      return pixels;
    },
  },
  data() {
    return {
      zoom: 1,
      mbl: false,
      mbr: false,
      borders: true,
    };
  },
  mounted() {
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mouseup', this.handleMouseUp);
  },
  unmounted() {
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }
}
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input.number::-webkit-outer-spin-button,
input.number::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.pixel {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
.pixel:last-of-type {
  border-right: 1px solid #ccc;
}
.pixel.last-row {
  border-bottom: 1px solid #ccc;
}
.pixel.no-border {
  border: none;
  margin: 0px;
}
</style>
