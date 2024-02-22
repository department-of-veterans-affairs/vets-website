import React from 'react';

export default function CurrencyWidget({ value }) {
  if (value && typeof value === 'number') {
    return (
      <span className="dd-privacy-hidden" data-dd-action-name="currency value">
        ${value.toFixed(2)}
      </span>
    );
  }

  return (
    <span className="dd-privacy-hidden" data-dd-action-name="currency value">
      {value}
    </span>
  );
}
