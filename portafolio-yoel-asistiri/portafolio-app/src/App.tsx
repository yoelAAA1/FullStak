// src/App.tsx — componente raíz: envuelve las rutas con el proveedor de sesión de admin

import AdminProvider from './context/AdminProvider';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    // Todo lo que está dentro de AdminProvider puede usar useAdmin()
    <AdminProvider>
      <AppRouter />
    </AdminProvider>
  );
}
