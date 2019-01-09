import React from 'react';

export default ({ formData }) => {
  const { dates, name } = formData;
  const hasDate = dates.from || dates.to;
  return (
    <div>
      <h5>{name}</h5>
      {hasDate && (
        <p>
          {dates.from} &mdash; {dates.to}
        </p>
      )}
    </div>
  );
};
