.PHONY: install test run

# Instalar dependencias de python
install:
	cd backend && pip install -r requirements.txt

# Ejecutar tests con pytest
test:
	cd backend && pytest -v

# Lanzar el servidor Flask
run:
	cd backend && python app.py
