<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <router-link :to="{name: 'home'}">Home</router-link>&nbsp;|&nbsp;
    <router-link :to="{name: 'sprite-creator'}">Sprite Creator</router-link>
  </header>

  <RouterView />
</template>

<style scoped>
</style>
