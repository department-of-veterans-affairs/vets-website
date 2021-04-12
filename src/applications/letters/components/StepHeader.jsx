import React from 'react';
import PropTypes from 'prop-types';

function StepHeader({ current, steps, name, children }) {
  const stepText = `Step ${current} of ${steps}: ${name}`;
  return (
    <div className="section-content">
      <div className="schemaform-chapter-progress">
        <div
          aria-valuenow={current}
          aria-valuemin="1"
          aria-valuetext={stepText}
          aria-valuemax={steps}
          className="nav-header nav-header-schemaform"
        >
          <h2 id="nav-form-header" className="vads-u-font-size--h4">
            {stepText}
          </h2>
        </div>
      </div>
      {children}
    </div>
  );
}

StepHeader.ProptTypes = {
  name: PropTypes.string,
  current: PropTypes.number,
  steps: PropTypes.number,
};

export default StepHeader;
