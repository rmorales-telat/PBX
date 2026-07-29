// Servidor mínimo: conecta a AMI, normaliza eventos y emite via Socket.IO
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const AmiClient = require('asterisk-ami-client');

const AMI_HOST = process.env.AMI_HOST || '127.0.0.1';
const AMI_PORT = process.env.AMI_PORT ? parseInt(process.env.AMI_PORT) : 5038;
const AMI_USER = process.env.AMI_USER || 'webdash';
const AMI_PASS = process.env.AMI_PASS || 'secret';
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir frontend estático
app.use(express.static('public'));

// Estado en memoria (MVP)
const calls = {}; // call_id -> { events: [...], last_state: 'RINGING' ... }

// Conectar AMI
const ami = new AmiClient();

async function startAmi() {
  try {
    await ami.connect(AMI_USER, AMI_PASS, { host: AMI_HOST, port: AMI_PORT });
    console.log('Conectado a AMI', AMI_HOST, AMI_PORT);
    ami.on('event', handleAmiEvent);
    ami.on('disconnect', () => console.warn('Desconectado de AMI'));
  } catch (err) {
    console.error('Error conectando a AMI:', err);
    setTimeout(startAmi, 5000);
  }
}

function nowISO() {
  return new Date().toISOString();
}

function normalizeAmiEvent(evt) {
  // Normalización simple: usa Uniqueid o Linkedid como call_id
  const call_id = evt.Uniqueid || evt.Linkedid || evt.uniqueid || evt.linkedid || `${evt.Channel || 'chan'}-${Date.now()}`;
  const eventName = evt.Event || evt.event || 'Unknown';
  const from = evt.CallerIDNum || evt.CallerID || evt.CallerIDName || null;
  const to = evt.Exten || evt.Called || evt.Destination || null;
  const channel = evt.Channel || evt.ChannelStateDesc || null;
  const cause = evt.Cause || evt.HangupCause || null;
  return {
    type: 'call.event',
    event: eventName,
    call_id,
    timestamp: nowISO(),
    raw: evt,
    from,
    to,
    channel,
    cause
  };
}

function handleAmiEvent(evt) {
  // Filtrar eventos irrelevantes si quieres
  const relevant = ['Newchannel','Newstate','Dial','Hangup','Bridge','BridgeEnter','BridgeLeave','AgentConnect','AgentCalled','QueueMemberAdded','QueueMemberRemoved','QueueEntry'];
  const name = evt.Event || evt.event || '';
  // Si no está en la lista y no tiene Uniqueid/Linkedid, puedes ignorarlo
  if (!name && !evt.Uniqueid && !evt.Linkedid) return;

  const normalized = normalizeAmiEvent(evt);

  // Guardar en estado en memoria
  const id = normalized.call_id;
  if (!calls[id]) calls[id] = { id, events: [], created_at: normalized.timestamp };
  calls[id].events.push(normalized);
  calls[id].last_state = normalized.event;

  // Emitir a todos los clientes conectados
  io.emit('call:event', normalized);

  // Opcional: log en consola
  console.log(`[AMI] ${normalized.event} call=${id} from=${normalized.from} to=${normalized.to}`);
}

// Socket.IO: al conectarse, envío el estado actual (últimos 50 llamadas)
io.on('connection', socket => {
  console.log('Cliente conectado', socket.id);
  const recent = Object.values(calls).slice(-50);
  socket.emit('initial-state', recent);
  socket.on('disconnect', () => console.log('Cliente desconectado', socket.id));
});

server.listen(PORT, () => {
  console.log(`Dashboard escuchando en http://localhost:${PORT}`);
  startAmi();
});
