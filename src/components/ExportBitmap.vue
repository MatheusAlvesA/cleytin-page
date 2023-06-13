<template>
  <div class="d-inline">
    <button
      class="btn btn-primary"
      type="button"
      data-bs-toggle="collapse"
      :data-bs-target="'#' + containerId"
      aria-expanded="false"
      :aria-controls="containerId"
    >
      Exportar C++
    </button>
    <div class="collapse mt-3" :id="containerId">
      <div class="card card-body">
        <div class="text-end p-2">
          <font-awesome-icon
            v-if="!copyCompleted"
            icon="fa-solid fa-copy"
            style="font-size: 20px;
            cursor: pointer;"
            @click="copy"
          />
          <font-awesome-icon v-else icon="fa-solid fa-check" style="font-size: 20px;" />
        </div>
        <highlightjs
            language="cpp"
            :code="code"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { makeid, equalColors, colorTo565Int } from '@/utils';

export default {
  props: {
    pixels: {
      type: Array,
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
    },
    selectedColor: {
      type: Object,
      required: true
    },
    alphaColor: {
      type: Object,
      required: true
    },
    monoTransparentMode: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    code() {
      return this.colorMode ? this.codeColor : this.codeMono;
    },
    codeMono() {
      const bufferDeclaration = this.codeBufferMono
      const code = `

CEBitmap *bitmap = new CEBitmap();
bitmap->setBuffer(buff);
bitmap->setHeight(${this.height});
bitmap->setWidth(${this.width});
bitmap->setBaseColor({${this.selectedColor.r}, ${this.selectedColor.g}, ${this.selectedColor.b}});
bitmap->setTransparent(${this.monoTransparentMode ? 'true' : 'false'});`;
      return bufferDeclaration + code;
    },
    codeBufferMono() {
      let bufferDeclaration = 'const uint8_t buff[] = {\n  ';
      let writtenBytesOnLine = 0;
      let byte = 0;
      let bitsShifted = 0;
      for (let i = 0; i < this.height; i++) {
        const pixelRow = this.pixels[i];
        for(let j = 0; j < this.width; j++) {
          const color = pixelRow[j];
          if(!equalColors(color, {r: 255, g: 255, b: 255})) {
            byte |= 1;
          }

          if(bitsShifted === 7) {
            bufferDeclaration += `0x${byte.toString(16)}, `;
            byte = 0;
            bitsShifted = 0;
            writtenBytesOnLine++;
          } else {
            byte = byte << 1;
            bitsShifted++;
          }

          if(writtenBytesOnLine === 10) {
            bufferDeclaration += '\n  ';
            writtenBytesOnLine = 0;
          }
        }
      }
      if(bitsShifted !== 0) {
          byte = byte << (7 - bitsShifted);
          bufferDeclaration += `0x${byte.toString(16)}, `;
        }
      bufferDeclaration = bufferDeclaration.slice(0, -2);
      bufferDeclaration += '\n};';
      return bufferDeclaration;
    },
    codeBufferColor() {
      let bufferDeclaration = 'const uint16_t buff[] = {\n  ';
      let writtenBytesOnLine = 0;
      for (let i = 0; i < this.height; i++) {
        const pixelRow = this.pixels[i];
        for(let j = 0; j < this.width; j++) {
          const color = pixelRow[j];
          bufferDeclaration += `0x${colorTo565Int(color).toString(16)}, `;

          writtenBytesOnLine++;
          if(writtenBytesOnLine === 10) {
            bufferDeclaration += '\n  ';
            writtenBytesOnLine = 0;
          }
        }
      }
      bufferDeclaration = bufferDeclaration.slice(0, -2);
      bufferDeclaration += '\n};';
      return bufferDeclaration;
    },
    codeColor() {
      const bufferDeclaration = this.codeBufferColor
      const code = `

CEColorfulBitmap *bitmap = new CEColorfulBitmap();
bitmap->setBuffer(buff);
bitmap->setHeight(${this.height});
bitmap->setWidth(${this.width});
bitmap->setAlphaColor(0x${colorTo565Int(this.alphaColor).toString(16)});`;
      return bufferDeclaration + code;
    }
  },
  data() {
    return {
      containerId: makeid(5),
      copyCompleted: false
    };
  },
  methods: {
    async copy() {
      this.copyCompleted = false;
      await navigator.clipboard.writeText(this.code);
      this.copyCompleted = true;

      setTimeout(() => {
        this.copyCompleted = false;
      }, 2000);
    }
  },
}
</script>

<style scoped>
</style>
