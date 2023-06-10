<template>
  <main class="container">
    <div class="card">
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
                <span>Cor RGB(5;6;5)</span><br />
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
  </main>
</template>

<script>
import ColorSelector from '@/components/ColorSelector.vue';
import ColorPalette from '@/components/ColorPalette.vue';
import VerticalSwitch from '../components/VerticalSwitch.vue';
import { color888To565 } from '@/utils.js';

const maxWidth = 320;
const maxHeight = 240;

export default {
  components: { ColorSelector, ColorPalette, VerticalSwitch },
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
      colorMode: false
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
  },
  mounted() {}
}
</script>