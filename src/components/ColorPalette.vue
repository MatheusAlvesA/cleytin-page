<template>
    <div class="wrapper">
        <div class="palette">
            <div class="w-100 d-flex flex-wrap" v-if="lastColors.length > 0">
                <div
                    class="color"
                    v-for="(color, index) in lastColors"
                    :key="index"
                    @click="selectColor(color)"
                    :style="{backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`}"
                />
                <font-awesome-icon icon="fa-regular fa-clock" class="mt-1" />
            </div>
            <div
                class="color"
                v-for="(color, index) in colors"
                :key="index"
                @click="selectColor(color)"
                :style="{backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`}"
            />
        </div>
    </div>
</template>

<script>
import { equalColors } from '@/utils.js';

export default {
    props: {
        selectedColor: {
            type: Object,
            default: () => ({r: 0, g: 0, b: 0})
        }
    },
    data() {
        return {
            lastColors: [],
            colors: [
                {r: 210, g: 19, b: 18},
                {r: 237, g: 43, b: 42},
                {r: 241, g: 90, b: 89},
                {r: 205, g: 24, b: 24},
                {r: 133, g: 0, b: 0},
                {r: 17, g: 109, b: 110},
                {r: 92, g: 137, b: 132},
                {r: 84, g: 91, b: 119},
                {r: 55, g: 66, b: 89},
                {r: 10, g: 77, b: 104},
                {r: 8, g: 131, b: 149},
                {r: 5, g: 191, b: 219},
                {r: 154, g: 197, b: 244},
                {r: 153, g: 219, b: 245},
                {r: 167, g: 236, b: 238},
                {r: 255, g: 238, b: 187},
                {r: 245, g: 240, b: 187},
                {r: 219, g: 223, b: 170},
                {r: 179, g: 200, b: 144},
                {r: 115, g: 169, b: 173},
                {r: 170, g: 200, b: 167},
                {r: 201, g: 219, b: 178},
                {r: 227, g: 242, b: 193},
                {r: 246, g: 255, b: 222},
                {r: 66, g: 95, b: 87},
                {r: 116, g: 159, b: 130},
                {r: 168, g: 232, b: 144},
                {r: 207, g: 255, b: 141},
                {r: 12, g: 19, b: 79},
                {r: 29, g: 38, b: 125},
                {r: 92, g: 70, b: 156},
                {r: 212, g: 173, b: 252},
            ]
        }
    },
    emits: ['selectColor'],
    methods: {
        selectColor(color) {
            this.$emit('selectColor', color);
        }
    },
    watch: {
        selectedColor(color) {
            const copy = JSON.parse(JSON.stringify(this.lastColors));

            for (let i = 0; i < copy.length; i++) {
                const colorAlreadyIn = copy[i];
                if(equalColors(color, colorAlreadyIn)) return;
            }

            const size = copy.unshift(color);
            if(size > 5) copy.pop();

            this.lastColors = copy;
        }
    }
}
</script>

<style scoped>
.palette {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    width: 100%;
    padding: 20px;
    padding-bottom: 10px;
    padding-right: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
}

.color {
    width: 60px;
    height: 30px;
    border-radius: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
</style>