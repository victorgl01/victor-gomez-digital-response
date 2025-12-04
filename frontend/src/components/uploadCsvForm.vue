<script setup lang="ts">
import { ref } from 'vue'
import useUploadCsvForm from './useUploadCsvForm';
import humanizeString from '@/utils/humanizeString';

const fileInput = ref<HTMLInputElement | null>(null)
const showFile = ref(false) // Para forzar reactividad

const { loadFile, csvData } = useUploadCsvForm(fileInput);
</script>

<template>
  <form @submit.prevent="loadFile">
    <div>
      <label for="fileInput" id="fileInputLabel">Selecciona un archivo CSV para subir</label>
      <input type="file" accept=".csv" ref="fileInput" id="fileInput" @change="showFile = true"/>
    </div>
    <span v-if="showFile">Archivo subido</span>
    <input type="submit" value="Cargar CSV" />
  </form>
  <div v-if="csvData.filled">
    <h2>Vista previa de los datos CSV:</h2>
    <table border="1">
      <thead>
        <tr>
          <th v-for="(header) in csvData.headers" v-bind:key="header">{{ humanizeString(header) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in csvData.values" :key="rowIndex">
          <td v-for="(value, colIndex) in Object.values(row)" :key="colIndex">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
#fileInput {
  display: none;
}
#fileInputLabel {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
