import React from 'react';
import PropTypes from 'prop-types';

function StepHeader({ current, steps, name, children }) {
  return (
    <div className="section-content">
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin="1"
        aria-valuetext={`Step ${current} of ${steps}: ${name}`}
        aria-valuemax={steps}
        className="nav-header"
      >
        <h4>
          <span className="form-process-step current">{current}</span>
          <span className="form-process-total">of {steps}</span>
          {name}
        </h4>
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
