import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import useUploadCsvForm from '../components/useUploadCsvForm'

// Mock de alert
vi.stubGlobal('alert', vi.fn())

// Helper para cargar CSVs desde la carpeta test/csv
const loadCsvFile = (filename: string): string => {
  const filePath = resolve(__dirname, '../../..', 'test/csv', filename)
  return readFileSync(filePath, 'utf-8')
}

// Mock de File con el método text()
const createMockFile = (content: string, fileName: string) => {
  const file = new File([content], fileName, { type: 'text/csv' })
  file.text = () => Promise.resolve(content)
  return file
}

describe('useUploadCsvForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockFileInput = (content: string, fileName = 'test.csv') => {
    const file = createMockFile(content, fileName)
    const fileInput = ref<HTMLInputElement | null>({
      files: [file] as unknown as FileList,
    } as HTMLInputElement)
    return fileInput
  }

  const createEmptyFileInput = () => {
    return ref<HTMLInputElement | null>(null)
  }

  describe('loadFile', () => {
    it('should return false and show alert when no file is selected', async () => {
      const fileInput = createEmptyFileInput()
      const { loadFile } = useUploadCsvForm(fileInput)

      const result = await loadFile()

      expect(result).toBe(false)
      expect(alert).toHaveBeenCalledWith('No file selected')
    })

    it('should parse successful.csv with valid headers and return true', async () => {
      const csvContent = loadCsvFile('successful.csv')
      const fileInput = createMockFileInput(csvContent)
      const { loadFile, csvData } = useUploadCsvForm(fileInput)

      const result = await loadFile()

      expect(result).toBe(true)
      expect(csvData.value.filled).toBe(true)
      expect(csvData.value.headers).toContain('status')
    })

    it('should return false when empty.csv is loaded', async () => {
      const csvContent = loadCsvFile('empty.csv')
      const fileInput = createMockFileInput(csvContent)
      const { loadFile } = useUploadCsvForm(fileInput)

      const result = await loadFile()

      expect(result).toBe(false)
      expect(alert).toHaveBeenCalledWith('CSV is empty')
    })

    it('should return false when missing_header.csv is loaded', async () => {
      const csvContent = loadCsvFile('missing_header.csv')
      const fileInput = createMockFileInput(csvContent)
      const { loadFile } = useUploadCsvForm(fileInput)

      const result = await loadFile()

      expect(result).toBe(false)
      expect(alert).toHaveBeenCalled()
    })

    it('should return false when extra_header.csv is loaded', async () => {
      const csvContent = loadCsvFile('extra_header.csv')
      const fileInput = createMockFileInput(csvContent)
      const { loadFile } = useUploadCsvForm(fileInput)

      const result = await loadFile()

      expect(result).toBe(false)
      expect(alert).toHaveBeenCalled()
    })

    it('should return false when wrong_header.csv is loaded', async () => {
      const csvContent = loadCsvFile('wrong_header.csv')
      const fileInput = createMockFileInput(csvContent)
      const { loadFile } = useUploadCsvForm(fileInput)

      const result = await loadFile()

      expect(result).toBe(false)
      expect(alert).toHaveBeenCalled()
    })
  })

  describe('row validation', () => {
    it('should mark all rows with ✅ when successful.csv is loaded', async () => {
      const csvContent = loadCsvFile('successful.csv')
      const fileInput = createMockFileInput(csvContent)
      const { loadFile, csvData } = useUploadCsvForm(fileInput)

      await loadFile()

      // Filtrar filas vacías
      const nonEmptyRows = csvData.value.values.filter(row => row.some(cell => cell !== ''))
      nonEmptyRows.forEach(row => {
        expect(row).toContain('✅')
      })
    })

    it('should mark row with ❌ when wrong_date_format.csv is loaded', async () => {
      const csvContent = loadCsvFile('wrong_date_format.csv')
      const fileInput = createMockFileInput(csvContent)
      const { loadFile, csvData } = useUploadCsvForm(fileInput)

      await loadFile()

      // La primera fila tiene formato de fecha incorrecto
      expect(csvData.value.values[0]).toContain('❌')
    })

    it('should mark row with ❌ when wrong_audience_format.csv is loaded', async () => {
      const csvContent = loadCsvFile('wrong_audience_format.csv')
      const fileInput = createMockFileInput(csvContent)
      const { loadFile, csvData } = useUploadCsvForm(fileInput)

      await loadFile()

      // La primera fila tiene audience_id inválido
      expect(csvData.value.values[0]).toContain('❌')
    })

    it('should mark rows with ❌ when empty_values.csv is loaded', async () => {
      const csvContent = loadCsvFile('empty_values.csv')
      const fileInput = createMockFileInput(csvContent)
      const { loadFile, csvData } = useUploadCsvForm(fileInput)

      await loadFile()

      // Las filas con valores vacíos deben marcarse con ❌
      const rowsWithEmptyValues = csvData.value.values.filter(row => row.some(cell => cell === ''))
      rowsWithEmptyValues.forEach(row => {
        expect(row).toContain('❌')
      })
    })
  })
})
