# PMC Quote Studio

Reestructuracion profesional del prototipo original a una arquitectura full stack:

- `backend/`: API REST en Java con Spring Boot
- `frontend/`: SPA en React con Vite

## Objetivo

La aplicacion permite estimar tarifas freelance con base en:

- tipo de servicio
- experiencia
- complejidad
- mercado
- horas estimadas
- revisiones incluidas
- overhead operativo
- contingencia
- meta mensual y horas facturables
- urgencia de entrega

El backend centraliza la logica de negocio y el frontend entrega una experiencia moderna para analistas, freelancers o empresas.

## Que resuelve ahora

- freelancers: cuanto cobrar por hora y por proyecto sin quedar por debajo de un piso sostenible
- freelancers: cuanto pedir de anticipo y como defender la tarifa ante el cliente
- empresas: cuanto presupuestar por proyecto
- empresas: cuanto podria costar mensualmente un perfil similar y cual seria el costo empresa aproximado
- ambos: paquetes base, recomendado y premium para vender o comprar con mas criterio

## Estructura

```text
Prototipo PMC 2/
├── backend/
├── frontend/
├── app.py
└── README.md
```

`app.py` se conserva solo como referencia del prototipo inicial. No debe ejecutarse para la version actual.
La nueva aplicacion se ejecuta desde `backend` y `frontend`.

## Ejecutar en VS Code

Abre la carpeta raiz `Prototipo PMC 2` en VS Code.

- `Run and Debug` -> `PMC Backend` para iniciar el backend
- `Run and Debug` -> `PMC Frontend` para iniciar el frontend
- `Run and Debug` -> `PMC Full Stack` para iniciar ambos

Tambien puedes usar `Terminal` -> `Run Task` y escoger las tareas `backend: spring-boot:run` o `frontend: npm run dev`.

## Ejecutar backend

```bash
cd backend
mvn spring-boot:run
```

Backend disponible en `http://localhost:8081`.

## Ejecutar frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en `http://localhost:5173`.
El frontend usa proxy a `/api`, que redirige al backend en `http://localhost:8081`.

## Acceso por perfiles

La app ahora exige login antes de entrar al cotizador y tiene dos vistas:

- `Freelancer / Independiente`: enfocada en cuanto cobrar, anticipo, margen y paquetes
- `Empresa`: enfocada en cuanto pagar, sueldo mensual de referencia y costo empresa

Credenciales demo:

- Freelancer: `freelancer@pricepilot.app` / `demo123`
- Empresa: `empresa@pricepilot.app` / `demo123`

## Endpoint principal

`POST /api/quotes`

Header requerido:

```text
X-Auth-Token: <token_de_sesion>
```

Login:

`POST /api/auth/login`

Ejemplo de request:

```json
{
  "role": "EMPRESA",
  "service": "DESARROLLO",
  "experience": "SENIOR",
  "complexity": "ALTA",
  "market": "INTERNACIONAL",
  "hours": 42,
  "revisions": 3,
  "overheadPercent": 15,
  "contingencyPercent": 10,
  "monthlyIncomeGoal": 3500,
  "monthlyBillableHours": 120,
  "rushDelivery": true
}
```
