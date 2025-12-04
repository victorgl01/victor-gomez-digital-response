import type { CsvDataType } from "@/types/csvDataType";
import type { Ref } from "vue";
import { ref } from "vue";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


const csvData = ref<CsvDataType>({
  headers: [],
  values: [],
  filled: false,
});

// Recordar que ahora solo se acepta el formato que haya descrito en DATE_FORMAT

const REQUIRED_HEADERS = ['title', 'subject', 'scheduled_date', 'audience_id'];
const VALIDATED_FIELDS = ['scheduled_date', 'audience_id'];
const DELIMITER = ',';
const DATE_FORMAT = 'DD-MM-YYYY';

const useUploadCsvForm = (fileInput:  Ref<HTMLInputElement | null, HTMLInputElement | null>) => {
  const loadFile = async (): Promise<boolean> => {
    const file = fileInput.value?.files?.[0];
    if (!file) {
      alert("No file selected");
      return false;
    }
    const text = await file.text();
    parseCsv(text);
    if (!checkHeaders()) { return false; }
    addStatusColumnAndValues();
    return true;
  };

  const parseCsv = (text: string): void => {
    const rows = text.split("\n").map(row => row.split(DELIMITER));
    csvData.value = {
      headers: rows[0] || [],
      values: rows.slice(1),
      filled: true,
    };
  }

  const checkHeaders = () => {
    const headers = csvData.value.headers || [];
    if (headers.length === 0 || headers.every(h => h.trim() === '')) {
      alert("CSV is empty");
      return false;
    }

    // Filtramos por boolean para eliminar los undefined en las iteraciones en la que no se devuelve nada
    const missing_headers = REQUIRED_HEADERS.map((header: string) => {
      if (!headers.includes(header)) {
        return `Missing required header: ${header}`;
      }
    }).filter(Boolean);

    const extra_headers = headers.map((header) => {
      if (!REQUIRED_HEADERS.includes(header) && header.trim() !== '') {
        return `Extra header found: ${header}`;
      }
    }).filter(Boolean);

    if (missing_headers.length > 0 || extra_headers.length > 0) {
      csvData.value = { headers: [], values: [], filled: false };
      alert([...missing_headers, ...extra_headers].join("\n"));
      return false;
    }

    return true;
  }

  const addStatusColumnAndValues = () => {
    const headers = csvData.value.headers || [];
    if (!headers.includes('status')) {
      headers.push('status');
      csvData.value.values.forEach((row) => {
        checkRowValues(row);
      });
    }
  }

  const checkRowValues = (row: string[]) => {
    let error = false
    VALIDATED_FIELDS.forEach((field) => {
      const headerIndex = csvData.value.headers.indexOf(field);
      const value = row[headerIndex] || '';
      if (field === 'scheduled_date') {
        const customDate = dayjs(value, DATE_FORMAT, true).toDate();
        if (isNaN(customDate.getTime())) {
          console.log('Invalid date:', value);
          row.push('❌');
          error = true;
          return;
        }
      }

      if (field === 'audience_id') {
        // añadimos base 10 para evitar errores con números que empiezan por 0 (javascript y su magia)
        const audienceId = parseInt(value, 10);
        if (isNaN(audienceId)) {
          console.log('Invalid audience_id:', audienceId);
          row.push('❌');
          error = true;
          return;
        }
      }

    });
    if (row.includes('') && !error) {
      row.push('❌');
      error = true;
    }
    if (!error) {
      row.push('✅');
    }
  }

  return {
    csvData,
    loadFile,
  };
}
export default useUploadCsvForm;