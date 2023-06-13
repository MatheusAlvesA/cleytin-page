<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <router-link :to="{name: 'home'}">Home</router-link>&nbsp;|&nbsp;
    <router-link :to="{name: 'sprite-creator'}">Sprite Creator</router-link>
  </header>

  <RouterView />

  <div class="d-flex justify-content-center mt-5">
    Feito com ❤️ pelo&nbsp;<a href="https://matheusalves.com.br" target="_blank">Matheus</a>
  </div>
</template>

<style scoped>
</style>
