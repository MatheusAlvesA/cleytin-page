<template>
  <main class="container">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title mb-3">Cores</h5>
        <span>Cor selecionada</span><br />
        <ColorSelector v-model="selectedColor" />
      </div>
    </div>
  </main>
</template>

<script>
import ColorSelector from '@/components/ColorSelector.vue';

const maxWidth = 320;
const maxHeight = 240;

export default {
  components: { ColorSelector },
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
      monochromaticMode: false
    };
  },
  methods: {},
  mounted() {}
}
</script>