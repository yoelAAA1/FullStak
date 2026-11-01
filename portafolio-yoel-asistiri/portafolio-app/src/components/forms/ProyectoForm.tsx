// src/components/forms/ProyectoForm.tsx — el MISMO formulario sirve para crear y para editar

import { useForm } from 'react-hook-form';
import type { Categoria, Proyecto, ProyectoDTO } from '../../interfaces/Proyecto';
import type { Tecnologia } from '../../interfaces/Tecnologia';
import { CATEGORIAS, LISTA_CATEGORIAS } from '../../utils/etiquetas';
import Button from '../ui/Button';
import './Formulario.css';

// Valores tal como los maneja el formulario (los checkbox devuelven los ids como TEXTO)
interface Valores {
  titulo: string;
  descripcion: string;
  emoji: string;
  categoria: Categoria | '';   // '' = todavía no eligió
  urlDemo: string;
  urlRepo: string;
  destacado: boolean;
  tecnologiaIds: string[];
}

interface Props {
  proyecto?: Proyecto;                              // si viene, el formulario es de EDICIÓN
  tecnologias: Tecnologia[];                        // para dibujar los checkbox
  onSubmit: (data: ProyectoDTO) => Promise<void>;   // qué hacer al guardar
  onCancel: () => void;                             // qué hacer al cancelar
}

// Devuelve 'campo__control' o 'campo__control campo__control--error'
const control = (conError: boolean) => `campo__control${conError ? ' campo__control--error' : ''}`;

export default function ProyectoForm({ proyecto, tecnologias, onSubmit, onCancel }: Props) {
  // useForm: register conecta cada input, handleSubmit valida antes de enviar,
  // errors = errores por campo, isSubmitting = está enviando, isDirty = cambió algo
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<Valores>({
    // Valores iniciales: los del proyecto (edición) o vacíos (creación)
    defaultValues: {
      titulo:        proyecto?.titulo ?? '',
      descripcion:   proyecto?.descripcion ?? '',
      emoji:         proyecto?.emoji ?? '💻',
      categoria:     proyecto?.categoria ?? '',
      urlDemo:       proyecto?.urlDemo ?? '',
      urlRepo:       proyecto?.urlRepo ?? '',
      destacado:     proyecto?.destacado ?? false,
      tecnologiaIds: proyecto?.tecnologias.map((t) => String(t.id)) ?? [],
    },
  });

  // Convierte los valores del formulario al formato que espera la API
  const enviar = (v: Valores) =>
    onSubmit({
      ...v,
      categoria: v.categoria as Categoria,          // "required" garantiza que no está vacío
      tecnologiaIds: v.tecnologiaIds.map(Number),   // ['1','6'] → [1, 6]
    });

  return (
    // noValidate: desactiva los globos del navegador; valida React Hook Form
    <form onSubmit={handleSubmit(enviar)} className="formulario" noValidate>
      <div className="formulario__fila formulario__fila--titulo">
        <div>
          <label htmlFor="titulo" className="campo__etiqueta">Título *</label>
          <input
            id="titulo"
            // register('titulo', reglas) devuelve name, onChange, onBlur y ref para el input
            {...register('titulo', {
              required: 'El título es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            })}
            className={control(!!errors.titulo)}   // !! convierte a booleano
          />
          {errors.titulo && <p className="campo__error">{errors.titulo.message}</p>}
        </div>
        <div>
          <label htmlFor="emoji" className="campo__etiqueta">Emoji</label>
          <input id="emoji" {...register('emoji')} className="campo__control campo__control--centrado" />
        </div>
      </div>

      <div>
        <label htmlFor="descripcion" className="campo__etiqueta">Descripción *</label>
        <textarea
          id="descripcion"
          rows={3}
          {...register('descripcion', {
            required: 'La descripción es obligatoria',
            minLength: { value: 10, message: 'Mínimo 10 caracteres' },
          })}
          className={control(!!errors.descripcion)}
        />
        {errors.descripcion && <p className="campo__error">{errors.descripcion.message}</p>}
      </div>

      <div>
        <label htmlFor="categoria" className="campo__etiqueta">Categoría *</label>
        <select
          id="categoria"
          {...register('categoria', { required: 'Elige una categoría' })}
          className={control(!!errors.categoria)}
        >
          <option value="">-- Seleccionar --</option>
          {LISTA_CATEGORIAS.map((c) => <option key={c} value={c}>{CATEGORIAS[c]}</option>)}
        </select>
        {errors.categoria && <p className="campo__error">{errors.categoria.message}</p>}
      </div>

      <fieldset className="opciones">
        <legend className="campo__etiqueta">Tecnologías</legend>
        <div className="opciones__lista">
          {tecnologias.map((t) => (
            <label key={t.id} className="opcion">
              {/* Varios checkbox con el MISMO nombre → React Hook Form devuelve un array */}
              <input type="checkbox" value={t.id} {...register('tecnologiaIds')} />
              {t.nombre}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="formulario__fila">
        <div>
          <label htmlFor="urlDemo" className="campo__etiqueta">URL de la demo</label>
          <input id="urlDemo" type="url" placeholder="https://..." {...register('urlDemo')} className="campo__control" />
        </div>
        <div>
          <label htmlFor="urlRepo" className="campo__etiqueta">URL del repositorio</label>
          <input id="urlRepo" type="url" placeholder="https://github.com/..." {...register('urlRepo')} className="campo__control" />
        </div>
      </div>

      <label className="casilla">
        <input type="checkbox" {...register('destacado')} />
        Mostrar como proyecto destacado en la portada
      </label>

      <div className="formulario__acciones">
        {/* En edición, el botón solo se habilita si se cambió algún campo */}
        <Button type="submit" disabled={isSubmitting || (!!proyecto && !isDirty)}>
          {isSubmitting ? 'Guardando...' : proyecto ? 'Guardar cambios' : 'Crear proyecto'}
        </Button>
        {/* type="button" para que NO envíe el formulario */}
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
