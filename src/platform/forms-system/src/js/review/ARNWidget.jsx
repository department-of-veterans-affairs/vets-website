import React from 'react';

export default function ARNWidget({ value }) {
  if (value && value.length >= 7 && value.length <= 9) {
    return (
      <span
        className="dd-privacy-hidden"
        data-dd-action-name="Alien registration number"
      >
        {`${value.substr(0, 3)}-${value.substr(3, 3)}-${value.substr(6)}`}
      </span>
    );
  }

  return (
    <span
      className="dd-privacy-hidden"
      data-dd-action-name="Alien registration number"
    >
      {value}
    </span>
  );
}
