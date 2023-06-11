<template>
  <main class="container">
    <PixelMatrix
      :pixels="pixels"
      :width="width"
      :height="height"
      :color-selected="selectedColor"
      :color-mode="colorMode"
      :updateHeight="updateHeight"
      @update:width="updateWidth"
      @update:height="updateHeight"
      @setPixel="setPixel"
      @unsetPixel="unsetPixel"
    />

    <div class="card mt-4">
      <div class="card-body">
        <h5 class="card-title mb-3">Cores</h5>
        <div class="row">
          <div class="col-md-3">
            <span>Cor selecionada</span><br />
            <div class="d-flex flex-column justify-content-between align-items-center mt-3" style="min-height: 160px;">
              <div>
                <span>Clique para selecionar</span><br />
                <ColorSelector v-model="selectedColor" />
              </div>
              <font-awesome-icon icon="fa-solid fa-arrow-down" />
              <div>
                <span>
                  Cor RGB(5;6;5)
                  <font-awesome-icon
                    icon="fa-solid fa-info"
                    data-bs-toggle="tooltip"
                    style="color: rgb(5, 191, 219);"
                    data-bs-title="A tela do Cleytin usa um padrão de cores com 5 bits para o vermelho (R), 6 bits para o verde (G) e 5 bits para o azul (B)."
                  />
                </span><br />
                <ColorSelector :modelValue="selectedColor565" :disabled="true" />
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <span>Paleta de cores</span>
            <ColorPalette
              class=" mt-3"
              :selected-color="selectedColor"
              @selectColor="onColorSelectedFromPalette"
            />
          </div>
          <div class="col-md-3">
            <span>Modo de cores</span>
            <div class="d-flex flex-column justify-content-between align-items-center  mt-3">
              <VerticalSwitch
                v-model="colorMode"
                :onLabel="'Colorido'"
                :offLabel="'Monocromático'"
                class="ms-3"
                />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ExportBitmap class="mt-5"
      :pixels="pixels"
      :width="width"
      :height="height"
      :color-mode="colorMode"
      :selected-color="selectedColor"
    />
  </main>
</template>

<script>
import ColorSelector from '@/components/ColorSelector.vue';
import ColorPalette from '@/components/ColorPalette.vue';
import VerticalSwitch from '../components/VerticalSwitch.vue';
import { color888To565, initializeTooltips } from '@/utils.js';
import PixelMatrix from '../components/PixelMatrix.vue';
import ExportBitmap from '../components/ExportBitmap.vue';

const maxWidth = 320;
const maxHeight = 240;

export default {
  components: { ColorSelector, ColorPalette, VerticalSwitch, PixelMatrix, ExportBitmap },
  data() {
    const pixels = [];
    for (let i = 0; i < maxHeight; i++) {
      pixels.push([]);
      for (let j = 0; j < maxWidth; j++) {
        pixels[i].push({ r: 255, g: 255, b: 255 });
      }
    }

    return {
      pixels: pixels,
      width: 10,
      height: 10,
      selectedColor: { r: 0, g: 0, b: 0 },
      colorMode: true
    };
  },
  computed: {
    selectedColor565() {
      return color888To565(this.selectedColor);
    },
  },
  methods: {
    onColorSelectedFromPalette(color) {
      this.selectedColor = color;
    },
    updateWidth(value) {
      if(value > maxWidth) {
        value = maxWidth;
      }
      if(value < 1) {
        value = 1;
      }
      this.width = value;
    },
    updateHeight(value) {
      if(value > maxHeight) {
        value = maxHeight;
      }
      if(value < 1) {
        value = 1;
      }
      this.height = value;
    },
    setPixel({i, j}) {
      this.pixels[i].splice(j, 1, this.selectedColor);
    },
    unsetPixel({i, j}) {
      this.pixels[i].splice(j, 1, { r: 255, g: 255, b: 255});
    }
  },
  mounted() {
    initializeTooltips();
  }
}
</script>