<script setup lang="ts">
import UploadCsvForm from '@/components/uploadCsvForm.vue'
</script>

<template>
  <div class="container">
    <h1>Visualizador de CSV</h1>
    <UploadCsvForm />
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
