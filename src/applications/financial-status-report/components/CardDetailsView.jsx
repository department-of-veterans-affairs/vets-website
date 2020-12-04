import React from 'react';
import startCase from 'lodash/startCase';

const CardDetailsView = ({ formData, onEdit, index, title }) => {
  const keys = Object.keys(formData);
  const values = Object.values(formData);

  return (
    <div className="va-growable-background editable-row">
      <div className="row small-collapse vads-u-display--flex vads-u-align-items--center">
        <div className="vads-u-flex--fill">
          <div>
            {keys.map((key, i) => (
              <div key={`${key}-${i}`}>
                <span>{startCase(key)}: </span>
                <span>{values[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          className="usa-button-secondary edit vads-u-flex--auto"
          onClick={e => onEdit(e, index)}
          aria-label={`Edit ${title}`}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default CardDetailsView;
