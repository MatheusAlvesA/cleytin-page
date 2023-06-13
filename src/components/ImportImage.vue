<template>
  <div class="d-inline">
    <button
      class="btn btn-success"
      type="button"
      @click="$refs.fileInput.click()"
    >
      Importar imagem
    </button>
    <canvas ref="canvas" width="320" height="240" class="d-none" />
    <input type="file" ref="fileInput" class="d-none" @change="importImage" accept="image/png, image/jpeg" />
  </div>
</template>

<script>
import {maxScreenWidth, maxScreenHeight} from '@/utils.js';

export default {
  props: {},
  computed: {},
  data() {
    return {};
  },
  methods: {
    importImage(event) {
      const file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const payload = reader.result;
        this.prepareImage(payload);
      }
    },
    prepareImage(payload) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = payload;
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      img.addEventListener("load", () => {
        ctx.drawImage(img, 0, 0);
        img.style.display = "none";
        this.finishExtraction(this.extractPixels(img.width, img.height));
      });
    },
    extractPixels(w, h) {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = [];
      for (let i = 0; i < h && i < maxScreenHeight; i++) {
        pixels.push([]);
        for (let j = 0; j < w && j < maxScreenWidth; j++) {
          const index = (i * imageData.width + j) * 4;
          pixels[i].push({
            r: imageData.data[index],
            g: imageData.data[index + 1],
            b: imageData.data[index + 2],
          });
        }
      }
      return pixels;
    },
    finishExtraction(payload) {
      this.$emit("import", payload);
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
  },
}
</script>

<style scoped>
</style>
