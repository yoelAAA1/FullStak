// src/components/forms/ContactoForm.tsx — formulario de contacto público (guarda en la tabla mensajes)

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Send } from 'lucide-react';
import type { MensajeDTO } from '../../interfaces/Mensaje';
import { mensajeService } from '../../services/mensajeService';
import { SERVICIOS } from '../../utils/etiquetas';
import Button from '../ui/Button';
import './Formulario.css';

const control = (conError: boolean) => `campo__control${conError ? ' campo__control--error' : ''}`;

export default function ContactoForm() {
  // Respuesta para mostrar debajo: { ok: true, texto: 'Mensaje recibido...' } o null
  const [respuesta, setRespuesta] = useState<{ ok: boolean; texto: string } | null>(null);

  // control: controlForm → renombramos para no chocar con nuestra función control()
  const {
    register, handleSubmit, reset, control: controlForm,
    formState: { errors, isSubmitting },
  } = useForm<MensajeDTO>({ defaultValues: { presupuesto: 500 } });

  // useWatch: vuelve a dibujar el texto cada vez que se mueve el slider
  const presupuesto = useWatch({ control: controlForm, name: 'presupuesto' });

  // Se ejecuta solo si todas las validaciones pasan
  const enviar = async (datos: MensajeDTO) => {
    setRespuesta(null);                                   // limpiamos el aviso anterior
    try {
      const { mensaje } = await mensajeService.enviar(datos); // POST /api/mensajes
      setRespuesta({ ok: true, texto: mensaje });         // aviso verde
      reset();                                            // vacía el formulario
    } catch (err) {
      setRespuesta({ ok: false, texto: (err as Error).message }); // aviso rojo con el error de la API
    }
  };

  return (
    <form onSubmit={handleSubmit(enviar)} className="formulario" noValidate>
      <div className="formulario__fila">
        <div>
          <label htmlFor="nombre" className="campo__etiqueta">Nombre completo *</label>
          <input
            id="nombre"
            autoComplete="name"
            {...register('nombre', {
              required: 'El nombre es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            })}
            className={control(!!errors.nombre)}
          />
          {errors.nombre && <p className="campo__error">{errors.nombre.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="campo__etiqueta">Correo electrónico *</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', {
              required: 'El correo es obligatorio',
              // Misma expresión regular que validateEmail de la sesión 3 y que la API
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
            })}
            className={control(!!errors.email)}
          />
          {errors.email && <p className="campo__error">{errors.email.message}</p>}
        </div>
      </div>

      <div className="formulario__fila">
        <div>
          <label htmlFor="servicio" className="campo__etiqueta">Tipo de servicio</label>
          <select id="servicio" {...register('servicio')} className="campo__control">
            <option value="">-- Opcional --</option>
            {SERVICIOS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fecha" className="campo__etiqueta">Fecha preferida de contacto</label>
          <input id="fecha" type="date" {...register('fecha')} className="campo__control" />
        </div>
      </div>

      <div>
        <label htmlFor="presupuesto" className="campo__etiqueta">
          {/* toLocaleString('es-BO') → 1.500 con punto de miles */}
          Presupuesto estimado: <strong className="campo__valor">${Number(presupuesto).toLocaleString('es-BO')}</strong>
        </label>
        <input
          id="presupuesto"
          type="range"
          min={100}
          max={5000}
          step={100}
          {...register('presupuesto', { valueAsNumber: true })}   // lo entrega como número, no texto
          className="campo__rango"
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="campo__etiqueta">Mensaje *</label>
        <textarea
          id="mensaje"
          rows={4}
          {...register('mensaje', {
            required: 'El mensaje es obligatorio',
            minLength: { value: 20, message: 'Mínimo 20 caracteres' },
          })}
          className={control(!!errors.mensaje)}
          placeholder="Cuéntame sobre tu proyecto..."
        />
        {errors.mensaje && <p className="campo__error">{errors.mensaje.message}</p>}
      </div>

      {/* Aviso verde o rojo después de enviar */}
      {respuesta && (
        <p role="status" className={`alerta ${respuesta.ok ? 'alerta--ok' : 'alerta--error'}`}>
          {respuesta.ok ? '✅ ' : '❌ '}{respuesta.texto}
        </p>
      )}

      <div>
        <Button type="submit" disabled={isSubmitting} icon={<Send size={16} />}>
          {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
        </Button>
      </div>
    </form>
  );
}
