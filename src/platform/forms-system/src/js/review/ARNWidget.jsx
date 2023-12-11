import React from 'react';

export default function ARNWidget({ value }) {
  if (value && value.length >= 7 && value.length <= 9) {
    return (
      <span>
        {`${value.substr(0, 3)}-${value.substr(3, 3)}-${value.substr(6)}`}
      </span>
    );
  }

  return <span>{value}</span>;
}
