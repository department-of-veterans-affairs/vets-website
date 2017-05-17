import PropTypes from 'prop-types';
import React from 'react';

import { getCurrentFormStep, getCurrentPageName } from '../utils/helpers';

export default class NavHeader extends React.Component {
  render() {
    const { chapters, path, className } = this.props;
    const total = chapters.length;

    return getCurrentFormStep(chapters, path)
      ? <h4
          role="progressbar"
          aria-valuenow={getCurrentFormStep(chapters, path)}
          aria-valuemin="1"
          aria-valuetext={`Step ${getCurrentFormStep(chapters, path)} of ${total}: ${getCurrentPageName(chapters, path)}`}
          aria-valuemax={total}
          className={`nav-header ${className}`}>
        <span className="form-process-step current">{getCurrentFormStep(chapters, path)}</span> of {total} {getCurrentPageName(chapters, path)}
      </h4>
      : null;
  }
}

NavHeader.propTypes = {
  path: PropTypes.string.isRequired,
  chapters: PropTypes.array.isRequired,
  className: PropTypes.string
};
