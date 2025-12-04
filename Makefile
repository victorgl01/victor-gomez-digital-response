.PHONY: backend-install backend-test backend-run frontend-install frontend-test frontend-run frontend-build

# Instalar dependencias de python
backend-install:
	cd backend && pip install -r requirements.txt

# Ejecutar tests con pytest
backend-test:
	cd backend && pytest -v

# Lanzar el servidor Flask
backend-run:
	cd backend && python app.py

# --------------------------------------------------------------

# Instalar dependencias de npm
frontend-install:
	cd frontend && npm install

# Ejecutar tests con vitest
frontend-test:
	cd frontend && npm run test:unit

# Lanzar el servidor de desarrollo
frontend-run:
	cd frontend && npm run dev
