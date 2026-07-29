-- Esquema MVP opcional para guardar CDRs si lo quieres luego
CREATE TABLE cdr (
  id SERIAL PRIMARY KEY,
  call_id TEXT UNIQUE,
  caller TEXT,
  callee TEXT,
  direction TEXT,
  start_time TIMESTAMP,
  answer_time TIMESTAMP,
  end_time TIMESTAMP,
  duration INTEGER,
  disposition TEXT,
  recording_url TEXT,
  last_state TEXT,
  raw_events JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
