import React from 'react';

export default function SelectField({
    id,
    label,
    options = [],
    placeholder = "Select an option",
    className = "",
    multiple = false,
    disabled = false,
    value,
    onChange,
    ...props
}) {
    return (
        <div className={`${className}`}>
            {label && <label htmlFor={id} className="form-label">{label}</label>}
            <select
                id={id}
                className="form-select"
                value={value}
                multiple={multiple}
                disabled={disabled}
                onChange={onChange}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
