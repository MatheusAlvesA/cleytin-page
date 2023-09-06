<template>
  <div class="d-inline">
    <button
      class="btn btn-primary me-3"
      type="button"
      data-bs-toggle="collapse"
      aria-expanded="false"
      @click="togleCpp"
    >
      Exportar C++
    </button>
    <button
      class="btn btn-primary"
      type="button"
      data-bs-toggle="collapse"
      aria-expanded="false"
      @click="togleBase64"
    >
      Exportar Base64
    </button>
    <div class="collapse mt-3" :class="{'show': showCpp}">
      <div class="card card-body">
        <div class="text-end p-2">
          <font-awesome-icon
            v-if="!copyCompleted"
            icon="fa-solid fa-copy"
            style="font-size: 20px;
            cursor: pointer;"
            @click="() => copy(code)"
          />
          <font-awesome-icon v-else icon="fa-solid fa-check" style="font-size: 20px;" />
        </div>
        <highlightjs
            language="cpp"
            :code="code"
        />
      </div>
    </div>
    <div class="collapse mt-3" :class="{'show': showBase64}">
      <div class="card card-body">
        <div class="text-end p-2">
          <font-awesome-icon
            v-if="!copyCompleted"
            icon="fa-solid fa-copy"
            style="font-size: 20px;
            cursor: pointer;"
            @click="() => copy(base64Code)"
          />
          <font-awesome-icon v-else icon="fa-solid fa-check" style="font-size: 20px;" />
        </div>
        {{ base64Code }}
      </div>
    </div>
  </div>
</template>

<script>
import { equalColors, colorTo565Int, arrayBufferToBase64 } from '@/utils';

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
    base64Code() {
      if(this.colorMode) {
        const buffer = [];
        for (let i = 0; i < this.height; i++) {
          const pixelRow = this.pixels[i];
          for(let j = 0; j < this.width; j++) {
            const color = pixelRow[j];
            const color565 = colorTo565Int(color);
            buffer.push((color565 & 0xFF00) >> 8);
            buffer.push((color565 & 0xFF) >> 8);
          }
        }
        return arrayBufferToBase64(buffer);
      }

      let byte = 0;
      let bitsShifted = 0;
      const buffer = [];
      for (let i = 0; i < this.height; i++) {
        const pixelRow = this.pixels[i];
        for(let j = 0; j < this.width; j++) {
          const color = pixelRow[j];
          if(!equalColors(color, {r: 255, g: 255, b: 255})) {
            byte |= 1;
          }

          if(bitsShifted === 7) {
            buffer.push(byte);
            byte = 0;
            bitsShifted = 0;
          } else {
            byte = byte << 1;
            bitsShifted++;
          }
        }
      }
      if(bitsShifted !== 0) {
          byte = byte << (7 - bitsShifted);
          buffer.push(byte);
      }

      return arrayBufferToBase64(buffer);
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
      copyCompleted: false,
      showCpp: false,
      showBase64: false
    };
  },
  methods: {
    async copy(text) {
      this.copyCompleted = false;
      await navigator.clipboard.writeText(text);
      this.copyCompleted = true;

      setTimeout(() => {
        this.copyCompleted = false;
      }, 2000);
    },
    togleCpp() {
      this.showCpp = !this.showCpp;
      this.showBase64 = false;
    },
    togleBase64() {
      this.showBase64 = !this.showBase64;
      this.showCpp = false;
    }
  },
}
</script>

<style scoped>
</style>
