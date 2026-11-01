// src/components/ui/Button.tsx — botón reutilizable con variantes de color

// ButtonHTMLAttributes = todas las props normales de un <button> (onClick, type, disabled...)
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

// Nuestras props = las de un <button> + variant + icon
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost'; // color del botón
  icon?: ReactNode;                          // ícono opcional a la izquierda
}

export default function Button({ variant = 'primary', icon, children, className = '', ...props }: Props) {
  return (
    // `btn btn--${variant}` → "btn btn--primary". className permite sumar clases desde afuera (ej. btn--bloque)
    // {...props} pasa el resto de props (onClick, type, disabled...) al <button> real
    <button className={`btn btn--${variant} ${className}`} {...props}>
      {icon}
      {children}
    </button>
  );
}
