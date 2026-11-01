// src/pages/admin/LoginPage.tsx — pide la clave de administrador (ADMIN_API_KEY de la API)
// Ruta: /admin/login

import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import Button from '../../components/ui/Button';
import '../../components/forms/Formulario.css';
import './LoginPage.css';

export default function LoginPage() {
  const { esAdmin, ingresar } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [clave, setClave] = useState('');                    // lo que se escribe en el input
  const [error, setError] = useState<string | null>(null);  // mensaje de error
  const [enviando, setEnviando] = useState(false);          // deshabilita el botón mientras verifica

  // RequireAdmin guardó en state la ruta a la que se quería entrar; si no, vamos a proyectos
  const destino = (location.state as { desde?: string } | null)?.desde ?? '/admin/proyectos';

  // Si ya hay sesión, no tiene sentido mostrar el login
  if (esAdmin) return <Navigate to={destino} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();          // evita que el navegador recargue la página
    setEnviando(true);
    setError(null);
    try {
      await ingresar(clave);                 // prueba la clave contra GET /api/mensajes
      navigate(destino, { replace: true });  // correcta → al panel
    } catch (err) {
      setError((err as Error).message);      // incorrecta → "No autorizado"
    } finally {
      setEnviando(false);                    // pase lo que pase, rehabilita el botón
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login tarjeta">
      <div className="login__cabecera">
        <KeyRound className="login__icono" size={32} aria-hidden="true" />
        <h1 className="login__titulo">Acceso de administrador</h1>
        <p className="texto-suave">Escribe el valor de <code>ADMIN_API_KEY</code> del <code>.env</code> de la API.</p>
      </div>

      <div>
        <label htmlFor="clave" className="campo__etiqueta">Clave</label>
        {/* Input "controlado": su valor vive en el estado clave */}
        <input
          id="clave"
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="campo__control"
          autoComplete="current-password"
          required
        />
      </div>

      {error && <p role="alert" className="login__error">{error}</p>}

      <Button type="submit" disabled={enviando || !clave} className="btn--bloque">
        {enviando ? 'Verificando...' : 'Ingresar'}
      </Button>
    </form>
  );
}
