import React from 'react';
import PropTypes from 'prop-types';

const NoResultsBanner = ({ handleBackClick }) => (
  <va-banner
    className="response-no-results"
    headline="No Results Found"
    type="warning"
    visible
  >
    <p>
      We didn’t find any results that match your answers. If you added filters,
      try removing the filters. Or you can review or change your answers.
    </p>
    <va-link
      data-testid="back-link-banner"
      href="#"
      onClick={handleBackClick}
      text="Review or change your answers"
    />
    <p>
      We’re also planning to add more benefits and resources to this tool. Check
      back soon to find more benefits you may want to apply for.
    </p>
  </va-banner>
);

NoResultsBanner.propTypes = {
  data: PropTypes.array,
  handleBackClick: PropTypes.func,
};

export default NoResultsBanner;
