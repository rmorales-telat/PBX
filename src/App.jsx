import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const initialSteps = [
  {
    id: 'entrada',
    title: 'Entrada de la llamada',
    summary: 'Llamada entrante desde PSTN/Troncal hacia la PBX. Se registra caller ID y número destino.',
    details: `La llamada llega a la puerta de entrada del PBX. Se generan eventos: Newchannel, Newstate. Se asigna un uniqueid (call_id).`,
    tip: 'Menciona el origen (trunk) y el uniqueid como identificador único de la llamada.'
  },
  {
    id: 'ringing',
    title: 'Timbrado / Enrutamiento inicial',
    summary: 'La llamada se enruta al contexto/extension/plan de marcado correspondiente y comienza el timbrado.',
    details: `En este paso el dialplan decide destino: extensión directa, IVR, cola o AGI. Eventos típicos: Dial, Newstate (Ringing).`,
    tip: 'Explica cómo el dialplan (extensions.conf) define rutas y prioridades.'
  },
  {
    id: 'ivr',
    title: 'IVR / Árbol de opciones',
    summary: 'Si la ruta es un IVR, el usuario escucha un menú y elige opciones que definen el siguiente salto en el árbol.'
    ,
    details: `Muestra el árbol de opciones: por ejemplo 1 = Ventas, 2 = Soporte, 3 = Facturación. Cada opción puede invocar una subrutina o una cola.`,
    tip: 'Resalta manejo de tiempos de espera, intentos inválidos y opciones por defecto (timeout/invalid).'  
  },
  {
    id: 'queue',
    title: 'Cola (Queue) y distribución a agentes',
    summary: 'La llamada entra en una cola; se asigna posición, tiempos de espera y se pone a disposición de agentes.'
    ,
    details: `Se registran eventos de cola: QueueEntry, QueueMemberAdded, AgentConnect. Strategy: round-robin, least-recent, ringall, etc.`,
    tip: 'Explica monitoreo de métricas: tiempo medio, abandon rate y overflow.'
  },
  {
    id: 'overflow',
    title: 'Desborde / No respuesta',
    summary: 'Si no hay agentes disponibles o la espera supera umbrales, la llamada se desborda a acciones alternativas.',
    details: `Acciones típicas: transferir a otra cola, enviar a buzón de voz (voicemail), enviar correo/sms, o reproducir mensaje informativo.`,
    tip: 'Muestra TTL/thresholds y acciones de fallback.'
  },
  {
    id: 'hangup',
    title: 'Finalización y CDR',
    summary: 'La llamada termina (answered/busy/no-answer). Se genera el CDR con disposition, duración y grabaciones.'
    ,
    details: `Eventos: Hangup. El CDR contiene start_time, answer_time, end_time, disposition, recording_url. Es la base para reportes y auditoría.`,
    tip: 'Explica cómo usar el CDR para KPI y debugging.'
  }
]

export default function App () {
  const [steps] = useState(initialSteps)
  const [index, setIndex] = useState(0)

  const current = steps[index]

  function next () {
    setIndex(i => Math.min(i + 1, steps.length - 1))
  }
  function prev () {
    setIndex(i => Math.max(i - 1, 0))
  }
  function jumpTo (i) {
    setIndex(i)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Presentación: Tratado de la llamada (PBX)</h1>
        <p className="subtitle">Audiencia: Mixta · Idioma: Español · Modo: Storyboard interactivo</p>
      </header>

      <main className="main-grid">
        <aside className="timeline">
          <ul>
            {steps.map((s, i) => (
              <li key={s.id} className={i === index ? 'active' : ''} onClick={() => jumpTo(i)}>
                <div className="bullet">{i + 1}</div>
                <div className="step-meta">
                  <strong>{s.title}</strong>
                  <div className="small">{s.summary}</div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <section className="detail">
          <AnimatePresence mode="wait">
            <motion.div key={current.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
              <h2>{current.title}</h2>
              <p className="lead">{current.summary}</p>
              <div className="box">
                <h3>Explicación detallada</h3>
                <p>{current.details}</p>
                <h4>Consejo</h4>
                <p className="muted">{current.tip}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <aside className="controls">
          <div className="presenter-notes">
            <h3>Notas del presentador</h3>
            <p>Usa las flechas para avanzar. Aquí puedes pegar tu guion para este paso.</p>
          </div>
          <div className="buttons">
            <button onClick={prev} disabled={index === 0}>Prev</button>
            <button onClick={next} disabled={index === steps.length - 1}>Next</button>
            <div className="position">Paso {index + 1} de {steps.length}</div>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <small>Proyecto: pbx-presentation · Rama: pbx-presentation</small>
      </footer>
    </div>
  )
}
