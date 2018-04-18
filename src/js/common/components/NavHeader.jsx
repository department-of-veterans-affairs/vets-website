import PropTypes from 'prop-types';
import React from 'react';

import { getCurrentFormStep, getCurrentPageName } from '../../../platform/forms/helpers';

export default class NavHeader extends React.Component {
  render() {
    const { chapters, path, className } = this.props;
    const total = chapters.length;
    const step = getCurrentFormStep(chapters, path);
    const name = getCurrentPageName(chapters, path);

    return step
      ? <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin="1"
        aria-valuetext={`Step ${step} of ${total}: ${name}`}
        aria-valuemax={total}
        className={`nav-header ${className}`}>
        <h4><span className="form-process-step current">{step}</span> of {total} {name}</h4>
      </div>
      : null;
  }
}

NavHeader.propTypes = {
  path: PropTypes.string.isRequired,
  chapters: PropTypes.array.isRequired,
  className: PropTypes.string
};
