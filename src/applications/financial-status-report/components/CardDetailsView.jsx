import React from 'react';
import startCase from 'lodash/startCase';

const CardDetailsView = ({ formData }) => {
  const keys = Object.keys(formData);
  const values = Object.values(formData);
  return (
    <div>
      {keys.map((key, index) => (
        <div key={`${key}-${index}`}>
          <span>{startCase(key)}: </span>
          <span>{values[index]}</span>
        </div>
      ))}
    </div>
  );
};

export default CardDetailsView;
