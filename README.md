# Cómo ejecutar
He creado un Makefile para hacer mas facil la ejecucion de los proyectos y de los tests.

### Backend
Los comandos para backend son los siguientes:
```bash
make backend-install # Install backend requirements (requires python installed in your machine)
make backend-test # Execute backend tests
make backend-run # Execute backend server in port 5001
```

### Frontend
** Requerimientos: ** node en version 24.11 o nvm para poder tener la versión de node correcta
Los comandos para frontend son los siguientes:
```bash
make frontend-install # Install frontend requirements (requires node 24.11 installed in your machine)
make frontend-test # Execute frontend tests
make frontend-run # Execute frontend app in port 5173
```

Cada proyecto contiene un `comments.md` en el cual he añadido comentarios de por qué he tomado ciertas decisiones
