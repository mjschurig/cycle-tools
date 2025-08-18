import React from 'react';

interface WarningProps {
  title?: string;
  message: string;
  icon?: string;
  variant?: 'warning' | 'error' | 'info' | 'success';
  className?: string;
}

const variantStyles = {
  warning: {
    container: 'bg-yellow-600/20 border-yellow-400/40',
    title: 'text-yellow-300',
    message: 'text-yellow-200',
    defaultIcon: '⚠️'
  },
  error: {
    container: 'bg-red-600/20 border-red-400/40',
    title: 'text-red-300',
    message: 'text-red-200',
    defaultIcon: '❌'
  },
  info: {
    container: 'bg-blue-600/20 border-blue-400/40',
    title: 'text-blue-300',
    message: 'text-blue-200',
    defaultIcon: 'ℹ️'
  },
  success: {
    container: 'bg-green-600/20 border-green-400/40',
    title: 'text-green-300',
    message: 'text-green-200',
    defaultIcon: '✅'
  }
};

const Warning: React.FC<WarningProps> = ({ 
  title = 'Important Notice', 
  message, 
  icon, 
  variant = 'warning',
  className = '' 
}) => {
  const styles = variantStyles[variant];
  const displayIcon = icon || styles.defaultIcon;

  return (
    <div className={`mt-8 backdrop-blur-md ${styles.container} border rounded-xl p-6 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{displayIcon}</div>
        <div>
          <h3 className={`text-lg font-semibold ${styles.title} mb-2`}>{title}</h3>
          <p className={`${styles.message} mb-2`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Warning;