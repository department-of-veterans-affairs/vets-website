import React from 'react';
import PropTypes from 'prop-types';

const NoResultsBanner = ({ data, handleBackClick }) => (
  <va-banner
    className="response-no-results"
    headline="No Results Found"
    type="warning"
    visible
  >
    <p>
      <>
        {data && data.length > 0
          ? "We're unable to recomend benefits based on your responses. You can "
          : "We're unable to recomend benefits that match your filters. You can adjust your filters or "}
      </>
      <va-link
        data-testid="back-link-banner"
        href="#"
        onClick={handleBackClick}
        text="Go back review and update your entries"
      />
    </p>
    <p>
      We’re adding more benefits, so we encourage you to try again in the
      future.
    </p>
  </va-banner>
);

NoResultsBanner.propTypes = {
  data: PropTypes.array,
  handleBackClick: PropTypes.func,
};

export default NoResultsBanner;
