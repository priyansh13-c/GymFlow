import React, { useState } from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  floatingLabel = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;

  const basePaddingClasses = floatingLabel ? 'px-4 pt-6 pb-2' : 'px-4 py-3';
  const baseClasses = `w-full ${basePaddingClasses} border rounded-lg transition-all duration-200 focus-ring bg-white`;
  const focusClasses = isFocused || hasValue
    ? 'border-primary-500 shadow-soft'
    : 'border-neutral-300 hover:border-neutral-400';
  const errorClasses = error ? 'border-error-500 focus:border-error-500' : '';
  const disabledClasses = disabled ? 'bg-neutral-50 cursor-not-allowed opacity-60' : '';

  const inputClasses = `${baseClasses} ${focusClasses} ${errorClasses} ${disabledClasses} ${className}`;

  if (!floatingLabel) {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label} {required && <span className="text-error-500">*</span>}
          </label>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="text-sm text-error-600 mt-1">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={isFocused ? placeholder : ''}
        disabled={disabled}
        required={required}
        className={inputClasses}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {label && (
        <label
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isFocused || hasValue
              ? 'top-1.5 text-xs text-primary-600 font-semibold'
              : 'top-4 text-neutral-500 text-sm'
          }`}
        >
          {label} {required && <span className="text-error-500">*</span>}
        </label>
      )}
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;