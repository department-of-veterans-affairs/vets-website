import React from 'react';
import PropTypes from 'prop-types';

export const IssuesSubmitted = ({ issues }) => (
  <>
    <h4>You’ve selected these issues for review</h4>
    <ul className="vads-u-margin-top--0">{issues}</ul>
    <va-button
      class="screen-only"
      onClick={window.print}
      text="Print this confirmation"
      uswds
    />
  </>
);

IssuesSubmitted.propTypes = {
  issues: PropTypes.element.isRequired,
};
