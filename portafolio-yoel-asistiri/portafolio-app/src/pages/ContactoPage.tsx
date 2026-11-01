// src/pages/ContactoPage.tsx — datos de contacto + formulario
// Ruta: /contacto

import { Clock, Mail, MapPin } from 'lucide-react';
import ContactoForm from '../components/forms/ContactoForm';
import { PERFIL } from '../utils/etiquetas';
import './ContactoPage.css';

// Tarjetitas de la izquierda (se dibujan con .map)
const datos = [
  { icon: Mail,   titulo: 'Email',     texto: PERFIL.email },
  { icon: MapPin, titulo: 'Ubicación', texto: PERFIL.ubicacion },
  { icon: Clock,  titulo: 'Respuesta', texto: 'Menos de 48 horas' },
];

export default function ContactoPage() {
  return (
    <div>
      <header className="encabezado-pagina">
        <h1>Contáctame</h1>
        <p>¿Tienes un proyecto en mente? Hablemos.</p>
      </header>

      <div className="contacto">
        <aside className="contacto__datos">
          {datos.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="dato">
              <Icon className="dato__icono" aria-hidden="true" />
              <div>
                <p className="dato__titulo">{titulo}</p>
                <p className="dato__texto">{texto}</p>
              </div>
            </div>
          ))}
        </aside>

        <div className="contacto__formulario tarjeta">
          <ContactoForm />
        </div>
      </div>
    </div>
  );
}
