# Presentación PBX - Storyboard interactivo

Este proyecto es una SPA (Vite + React) que sirve como plantilla para una presentación interactiva del "Tratado de la llamada".

Características iniciales:
- Storyboard con línea de pasos (entrada, timbrado, IVR, cola, desborde, hangup)
- Panel de detalle con explicación y notas del presentador
- Controles Next / Prev y navegación directa a pasos
- Diseño responsive y animaciones básicas con framer-motion

Cómo ejecutar localmente:
1. Clona el repo y obtén la rama:
   - git fetch origin pbx-presentation
   - git checkout pbx-presentation

2. Instala dependencias:
   - npm install

3. Ejecuta el servidor de desarrollo:
   - npm run dev

4. Abre el navegador en la URL que muestre Vite (por defecto http://localhost:5173)

Editar los pasos:
- Los pasos se encuentran en `src/App.jsx` en la constante `initialSteps`. Modifica títulos, resumen, detalles y consejos para cada paso.

Siguientes mejoras posibles:
- Añadir diagrama IVR animado (canvas / d3 / cytoscape)
- Añadir modo de presentador con temporizador y notas privadas
- Export a PDF/Impresión del guion por paso
- Integrar audio pregrabado o locución

Si quieres, continúo completando los pasos uno por uno mientras me dictas el contenido que quieres en cada tarjeta.
