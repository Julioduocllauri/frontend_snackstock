import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  onClick 
}) => {
  const baseStyles = 'rounded-2xl shadow-sm transition-all';
  
  const variants = {
    default: 'bg-white border border-slate-200 hover:shadow-md',
    gradient: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
  };
  
  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
