import React from 'react';

import ExpandingGroup from '../components/ExpandingGroup';

export default function RadioWidget({
  options,
  value,
  disabled,
  onChange,
  id,
}) {
  const {
    enumOptions,
    labels = {},
    labelSecondaryText = {},
    nestedContent = {},
  } = options;

  // nested content could be a component or just jsx/text
  let content = nestedContent[value];
  if (typeof content === 'function') {
    const NestedContent = content;
    content = <NestedContent />;
  }

  return (
    <div>
      {enumOptions.map((option, i) => {
        const checked = option.value === value;
        const label = labels[option.value] || option.label;
        const secondaryText =
          labelSecondaryText[option.value] || option.labelSecondaryText;

        const className = secondaryText
          ? 'form-radio-buttons schemaform-radio-secondary'
          : 'form-radio-buttons';
        const radioButton = (
          <div className={className} key={option.value}>
            <input
              type="radio"
              checked={checked}
              id={`${id}_${i}`}
              name={`${id}`}
              value={option.value}
              disabled={disabled}
              onChange={_ => onChange(option.value)}
            />
            <label htmlFor={`${id}_${i}`}>
              <span className="primary">{label}</span>
              {secondaryText ? (
                <span className="secondary">{secondaryText}</span>
              ) : (
                ''
              )}
            </label>
          </div>
        );

        if (nestedContent[option.value]) {
          return (
            <ExpandingGroup open={checked} key={option.value}>
              {radioButton}
              <div className="schemaform-radio-indent">{content}</div>
            </ExpandingGroup>
          );
        }

        return radioButton;
      })}
    </div>
  );
}
