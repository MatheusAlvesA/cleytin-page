<template>
  <div>
    <button
      class="btn btn-primary"
      type="button"
      data-bs-toggle="collapse"
      :data-bs-target="'#' + containerId"
      aria-expanded="false"
      :aria-controls="containerId"
    >
      Exportar bitmap
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
import { makeid } from '@/utils';

export default {
  props: {},
  emits: [],
  computed: {
    code() {
      return 'int x = 10;';
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
  mounted() {}
}
</script>

<style scoped>
</style>
