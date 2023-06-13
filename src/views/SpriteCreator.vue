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
            <div class="d-flex flex-column justify-content-between align-items-center mt-3" style="min-height: 200px;">
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

              <div v-show="colorMode">
                <span>
                  Cor alpha
                  <font-awesome-icon
                    icon="fa-solid fa-info"
                    data-bs-toggle="tooltip"
                    style="color: rgb(5, 191, 219);"
                    data-bs-title="A engine não tem suporte a RGBA, mas é possível configurar uma cor para ser transparente. Todo pixel com essa cor será ignorado na hora de renderizar o sprite."
                  />
                </span><br />
                <ColorSelector v-model="alphaColor" />
              </div>
              <div v-show="!colorMode" style="min-height: 53px; padding-top: 10px;">
                <input type="checkbox" class="form-check-input" id="monoTransparentModeInput" :checked="monoTransparentMode" @change="monoTransparentMode = $event.target.checked">
                <label class="form-check-label" for="monoTransparentModeInput">
                  &nbsp;Modo transparente
                  <font-awesome-icon
                    icon="fa-solid fa-info"
                    data-bs-toggle="tooltip"
                    style="color: rgb(5, 191, 219);"
                    data-bs-title="Os pixels não marcados serão da cor base de fundo da tela, normalmente branco. Selecione essa opção para que eles sejam transparentes."
                  />
                </label>
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

    <div class="mt-5">
      <ExportBitmap
        :pixels="pixels"
        :width="width"
        :height="height"
        :color-mode="colorMode"
        :selected-color="selectedColor"
        :alpha-color="alphaColor"
        :mono-transparent-mode="monoTransparentMode"
      />
      <button
        class="btn btn-primary ms-3"
        type="button"
        @click="saveState"
      >
        Exportar rascunho
      </button>
      <button
        class="btn btn-success ms-3"
        type="button"
        @click="importDialog"
      >
        Importar rascunho
      </button>
      <ImportImage
        class="ms-3"
        @import="setPixels"
      />
    </div>

    <input type="file" ref="stateFileInput" style="display: none;" @change="importState" />
  </main>
</template>

<script>
import ColorSelector from '@/components/ColorSelector.vue';
import ColorPalette from '@/components/ColorPalette.vue';
import VerticalSwitch from '../components/VerticalSwitch.vue';
import { color888To565, initializeTooltips, download, maxScreenWidth, maxScreenHeight } from '@/utils.js';
import PixelMatrix from '../components/PixelMatrix.vue';
import ExportBitmap from '../components/ExportBitmap.vue';
import ImportImage from '../components/ImportImage.vue';

export default {
  components: { ColorSelector, ColorPalette, VerticalSwitch, PixelMatrix, ExportBitmap, ImportImage },
  data() {
    const pixels = [];
    for (let i = 0; i < maxScreenHeight; i++) {
      pixels.push([]);
      for (let j = 0; j < maxScreenWidth; j++) {
        pixels[i].push({ r: 255, g: 255, b: 255 });
      }
    }

    return {
      pixels: pixels,
      width: 10,
      height: 10,
      selectedColor: { r: 0, g: 0, b: 0 },
      alphaColor: { r: 0, g: 0, b: 0 },
      colorMode: true,
      monoTransparentMode: false,
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
      if(value > maxScreenWidth) {
        value = maxScreenWidth;
      }
      if(value < 1) {
        value = 1;
      }
      this.width = value;
    },
    updateHeight(value) {
      if(value > maxScreenHeight) {
        value = maxScreenHeight;
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
    },
    saveState() {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      const today  = new Date();
      const dateString = today.toLocaleDateString("pt-BR", options);

      download(JSON.stringify(this.$data), `rascunho_sprite_${dateString}.json`, 'application/json');
    },
    importDialog() {
      this.$refs.stateFileInput.click();
    },
    importState(event) {
      const file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        const payload = JSON.parse(evt.target.result);
        this.pixels = payload.pixels;
        this.width = payload.width;
        this.height = payload.height;
        this.selectedColor = payload.selectedColor;
        this.alphaColor = payload.alphaColor;
        this.colorMode = payload.colorMode;
        this.monoTransparentMode = payload.monoTransparentMode;
      }
    },
    setPixels(payload) {
      this.pixels = payload;
      this.width = payload[0].length;
      this.height = payload.length;
    }
  },
  mounted() {
    initializeTooltips();
  }
}
</script>