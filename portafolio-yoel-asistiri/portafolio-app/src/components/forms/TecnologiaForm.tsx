// src/components/forms/TecnologiaForm.tsx — crear o editar una tecnología

import { useForm } from 'react-hook-form';
import type { Tecnologia, TecnologiaDTO } from '../../interfaces/Tecnologia';
import { AREAS, LISTA_AREAS } from '../../utils/etiquetas';
import Button from '../ui/Button';
import './Formulario.css';

interface Props {
  tecnologia?: Tecnologia;                             // si viene → edición
  onSubmit: (data: TecnologiaDTO) => Promise<void>;
  onCancel: () => void;
}

export default function TecnologiaForm({ tecnologia, onSubmit, onCancel }: Props) {
  // Aquí los valores del formulario tienen la misma forma que el DTO, así que usamos TecnologiaDTO
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<TecnologiaDTO>({
    defaultValues: { nombre: tecnologia?.nombre ?? '', area: tecnologia?.area ?? 'FRONTEND' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="formulario" noValidate>
      <div>
        <label htmlFor="nombre" className="campo__etiqueta">Nombre *</label>
        <input
          id="nombre"
          {...register('nombre', { required: 'El nombre es obligatorio' })}
          className={`campo__control${errors.nombre ? ' campo__control--error' : ''}`}
          placeholder="Vue, Docker, MongoDB..."
        />
        {errors.nombre && <p className="campo__error">{errors.nombre.message}</p>}
      </div>

      <div>
        <label htmlFor="area" className="campo__etiqueta">Área *</label>
        <select id="area" {...register('area')} className="campo__control">
          {LISTA_AREAS.map((a) => <option key={a} value={a}>{AREAS[a]}</option>)}
        </select>
      </div>

      <div className="formulario__acciones">
        <Button type="submit" disabled={isSubmitting || (!!tecnologia && !isDirty)}>
          {isSubmitting ? 'Guardando...' : tecnologia ? 'Guardar cambios' : 'Crear tecnología'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
