import React from 'react';
import PropTypes from 'prop-types';

const Checklist = ({ options, onChange, isBoxChecked }) => {
  return (
    <div className="checkbox-list">
      {options?.map((option, key) => (
        <div key={option + key} className="checkbox-list-item">
          <input
            type="checkbox"
            id={option + key}
            name={option}
            value={option}
            checked={isBoxChecked(option)}
            onChange={onChange}
          />
          <label className="vads-u-margin-y--2" htmlFor={option + key}>
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

Checklist.propTypes = {
  isBoxChecked: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default Checklist;
