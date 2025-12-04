import pytest
import base64
import os

from services.validate_csv_service import ValidateCSVService


class TestValidateCSVService:
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.csv_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'test', 'csv')
    
    def _load_csv_as_base64(self, filename: str) -> str:
        filepath = os.path.join(self.csv_dir, filename)
        with open(filepath, 'rb') as f:
            content = f.read()
        return base64.b64encode(content).decode('utf-8')
    
    def test_successful_csv_validation(self):
        """Test: CSV válido debe retornar status success"""
        csv_base64 = self._load_csv_as_base64('successful.csv')
        service = ValidateCSVService(csv_base64)
        result = service.process()
        
        assert result['status'] == 'success'
    
    def test_empty_csv_returns_error(self):
        """Test: CSV vacío debe retornar error"""
        csv_base64 = self._load_csv_as_base64('empty.csv')
        service = ValidateCSVService(csv_base64)
        result = service.process()
        
        assert result['status'] == 'error'
    
    def test_extra_header_returns_error(self):
        """Test: CSV con header extra debe retornar error"""
        csv_base64 = self._load_csv_as_base64('extra_header.csv')
        service = ValidateCSVService(csv_base64)
        result = service.process()
        
        assert result['status'] == 'error'
        assert 'Exceeding' in result['message']
    
    def test_missing_header_returns_error(self):
        """Test: CSV con header faltante debe retornar error"""
        csv_base64 = self._load_csv_as_base64('missing_header.csv')
        service = ValidateCSVService(csv_base64)
        result = service.process()
        
        assert result['status'] == 'error'
        assert 'Missing' in result['message']
    
    def test_wrong_header_returns_error(self):
        """Test: CSV con header incorrecto debe retornar error"""
        csv_base64 = self._load_csv_as_base64('wrong_header.csv')
        service = ValidateCSVService(csv_base64)
        result = service.process()
        
        assert result['status'] == 'error'
        assert 'mismatch' in result['message']
    
    def test_wrong_date_format_returns_error(self):
        """Test: CSV con formato de fecha incorrecto debe retornar error"""
        csv_base64 = self._load_csv_as_base64('wrong_date_format.csv')
        service = ValidateCSVService(csv_base64)
        result = service.process()
        
        assert result['status'] == 'error'
    
    def test_wrong_audience_format_returns_error(self):
        """Test: CSV con formato de audience_id incorrecto debe retornar error"""
        csv_base64 = self._load_csv_as_base64('wrong_audience_format.csv')
        service = ValidateCSVService(csv_base64)
        result = service.process()
        
        assert result['status'] == 'error'
    
    def test_empty_values_returns_error(self):
        """Test: CSV con valores vacíos debe retornar error"""
        csv_base64 = self._load_csv_as_base64('empty_values.csv')
        service = ValidateCSVService(csv_base64)
        result = service.process()
        
        assert result['status'] == 'error'
