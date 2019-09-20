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

const PRIMARY_CARE = TYPES_OF_CARE.filter(care => care.group === 'primary');
const MENTAL_HEALTH = TYPES_OF_CARE.filter(
  care => care.group === 'mentalHealth',
);
const SPECIALTY = TYPES_OF_CARE.filter(care => care.group === 'specialty');

export default function TypeOfCareField({ formData, onChange, idSchema }) {
  return (
    <div>
      <fieldset>
        <legend className="vads-u-color--base vads-u-font-family--serif vads-u-padding-bottom--0 vads-u-padding-top--3">
          Primary care
        </legend>
        Including PAC Team, express care clinic, and primary care appointments
        with clinical pharmacists.
        {PRIMARY_CARE.map(care => (
          <RadioWidget
            key={care.id}
            id={idSchema.$id}
            option={care}
            checked={care.id === formData}
            onChange={onChange}
          />
        ))}
      </fieldset>
      <fieldset>
        <legend className="vads-u-color--base vads-u-font-family--serif vads-u-padding-bottom--0 vads-u-padding-top--3">
          Mental and behavioral health
        </legend>
        Including outpatient mental health and social services
        {MENTAL_HEALTH.map(care => (
          <RadioWidget
            key={care.id}
            id={idSchema.$id}
            option={care}
            checked={care.id === formData}
            onChange={onChange}
          />
        ))}
      </fieldset>
      <fieldset>
        <legend className="vads-u-color--base vads-u-font-family--serif vads-u-padding-bottom--0 vads-u-padding-top--3">
          Specialty care
        </legend>
        Including hearing aid support and some other types of specialty care
        {SPECIALTY.map(care => (
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
