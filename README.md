# PBX Dashboard (MVP)

Este esqueleto conecta a Asterisk AMI y expone eventos de llamadas en tiempo real a un frontend simple usando Socket.IO.

Archivos añadidos:
- package.json
- server.js
- .env.example
- public/index.html
- schema.sql (opcional)

Instrucciones rápidas:
1. Copia `.env.example` a `.env` y completa tus credenciales AMI.
2. Instala dependencias: `npm install`.
3. Ejecuta: `npm start`.
4. Abre `http://localhost:3000`.

Notas:
- Asegúrate de tener un usuario AMI con permisos para ver eventos en `manager.conf`.
- Este MVP guarda todo en memoria; si quieres persistencia, puedo añadir PostgreSQL y almacenar CDRs.
