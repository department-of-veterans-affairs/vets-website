import React from 'react';
import moment from 'moment';

const CalendarRadioOption = ({ id, fieldName, value, checked, onChange }) => {
  const time = moment(value);
  const meridian = time.format('A');
  const screenReaderMeridian = meridian.replace(/\./g, '').toUpperCase();

  return (
    <div className="vaos-calendar__option">
      <input
        id={`radio-${id}`}
        type="radio"
        name={fieldName}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label
        className="vads-u-margin--0 vads-u-font-weight--bold vads-u-color--primary"
        htmlFor={`radio-${id}`}
      >
        {time.format('h:mm')} <span aria-hidden="true">{meridian}</span>{' '}
        <span className="sr-only">{screenReaderMeridian}</span>
      </label>
    </div>
  );
};

export default CalendarRadioOption;
