// src/interfaces/Mensaje.ts — forma de un mensaje de contacto

// Lo que RECIBIMOS en el panel de admin (GET /mensajes)
export interface Mensaje {
  id: number;
  nombre: string;
  email: string;
  servicio: string | null;
  presupuesto: number | null;
  fecha: string | null;
  mensaje: string;
  leido: boolean;
  creadoEn: string;
}

// Lo que ENVÍA el formulario de contacto (POST /mensajes)
export interface MensajeDTO {
  nombre: string;
  email: string;
  servicio?: string;
  presupuesto?: number;
  fecha?: string;
  mensaje: string;
}

// Lo que RESPONDE la API al enviar: { id: 7, mensaje: "Mensaje recibido..." }
export interface MensajeEnviado {
  id: number;
  mensaje: string;
}
