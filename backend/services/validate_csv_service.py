import base64
import csv
import io
from types import SimpleNamespace
from datetime import datetime, date

# La estrategia aquí es decodificar el CSV desde un servicio separado.
# Esto permite que la lógica de validación sea reutilizable y facilmente modificable.

# Estos son constantes que se pueden modificar en cualquier momento de forma sencilla y accesible.
PERMITTED_HEADERS = ['title', 'subject', 'scheduled_date', 'audience_id']
DATE_FORMAT = "%d-%m-%Y"
CSV_DELIMITER = ','

class ValidateCSVService:

    def __init__(self, csv_base_64: str) -> None:
        self.csv_base_64 = csv_base_64
        self._content = None
        self._file = None
        self._reader = None
        self.headers = []

    def process(self) -> dict:
        parse_result = self._parse()
        if parse_result is not None:
            return parse_result

        missing_headers = set(PERMITTED_HEADERS) - set(self.headers)
        exceeding_headers = set(self.headers) - set(PERMITTED_HEADERS)
        if missing_headers or exceeding_headers:
            return self._build_error_response(f"CSV headers mismatch. Missing: {missing_headers}, Exceeding: {exceeding_headers}")

        errors = []
        for line, row in enumerate(self._reader, start=2):
            row_errors = self._validate_row(row)
            if row_errors:
                errors.append(f"Row {line} errors: {'; '.join(row_errors)}")
        if errors:
            return self._build_error_response(errors)
        return {"status": "success"}

    def _parse(self) -> dict | None:
        try:
            decoded_csv = base64.b64decode(self.csv_base_64, validate=True)
        except Exception as e:
            return self._build_error_response("Invalid base64 value")
        
        try:
            csv_content = decoded_csv.decode('utf-8')
        except UnicodeDecodeError as e:
            return self._build_error_response("Decoded content is not valid UTF-8")
        
        self._content = csv_content
        self._file = io.StringIO(csv_content)
        self._reader = csv.DictReader(self._file, delimiter=CSV_DELIMITER)
        self.headers = self._reader.fieldnames or []

    def _build_error_response(self, message: str | list[str]) -> dict:
        return {"status": "error", "message": message}
    
    def _validate_row(self, row: dict | None) -> list[str]:
        # Metaprogramación para validar automaticamente los campos permitidos si la funcion existe.
        # Esto permite que añadir un nuevo campo al csv sea tan simple como añadir el campo a PERMITTED_HEADERS
        # y crear una funcion _validate_<header> en este servicio.
        row_namespace = SimpleNamespace(**row)
        errors = []
        for header in PERMITTED_HEADERS:
            # Verifica si el valor esta presente.
            value = getattr(row_namespace, header, None)
            if not value:
                errors.append(f"Missing value for '{header.capitalize()}'")
                continue

            # Se ejecuta la validacion dinamicamente si existe la funcion.
            validate_method_name = f"_validate_{header}"
            validate_method = getattr(self, validate_method_name, None)
            if callable(validate_method):
                if not validate_method(value):
                    errors.append(f"Invalid value for '{header.capitalize()}'")
        return None if not errors else errors
    
    def _validate_scheduled_date(self, value: str) -> bool:
        try:
            datetime.strptime(value, DATE_FORMAT).date()
        except Exception:
            return False
        return True
    
    def _validate_audience_id(self, value: str) -> bool:
        try:
            int(value)
            return True
        except ValueError:
            return False