import React from 'react';
import { TYPES_OF_CARE } from '../utils/constants';

function RadioWidget({ option, checked, onChange, id }) {
  return (
    <div className="form-radio-buttons">
      <input
        type="radio"
        checked={checked}
        id={`${id}_${option.id}`}
        name={`${id}`}
        value={option.id}
        onChange={_ => onChange(option.id)}
      />
      <label htmlFor={`${id}_${option.id}`}>{option.name}</label>
    </div>
  );
}

const sortedCare = TYPES_OF_CARE.sort(
  (careA, careB) => (careA.name > careB.name ? 1 : -1),
);

export default function TypeOfCareField({ formData, onChange, idSchema }) {
  return (
    <div>
      <fieldset>
        {sortedCare.map(care => (
          <RadioWidget
            key={care.id}
            id={idSchema.$id}
            option={care}
            checked={care.id === formData}
            onChange={onChange}
          />
        ))}
      </fieldset>
    </div>
  );
}
