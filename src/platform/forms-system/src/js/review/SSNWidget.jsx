import React from 'react';

export default function SSNWidget({ value }) {
  if (value && value.length === 9) {
    return (
      <span
        className="dd-privacy-hidden"
        data-dd-action-name="Social Security number"
      >
        {`${value.substr(0, 3)}-${value.substr(3, 2)}-${value.substr(5)}`}
      </span>
    );
  }

  return (
    <span
      className="dd-privacy-hidden"
      data-dd-action-name="Social Security number"
    >
      {value}
    </span>
  );
}
