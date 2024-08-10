import React from 'react';
import PropTypes from 'prop-types';

const ProviderList = ({ providers }) => {
  return (
    <div className="vads-u-margin-top--2">
      {providers.map((provider, index) => (
        <div key={index}>
          <div className="vads-u-font-weight--bold">
            {provider.providerName}
          </div>
          <div>{provider.providerOrganization}</div>
          <div>{provider.distance}</div>
          <div>First available: {provider.firstAvailable}</div>
          <div>Next available: {provider.nextAvailable}</div>
          <div className="vads-u-font-weight--bold vads-u-margin-top--2">
            <va-link
              aria-label={provider.reviewText}
              text={provider.reviewText}
              data-testid="review-available-appointments-link"
              tabindex="0"
            />
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

ProviderList.propTypes = {
  providers: PropTypes.arrayOf(
    PropTypes.shape({
      providerName: PropTypes.string.isRequired,
      providerOrganization: PropTypes.string.isRequired,
      distance: PropTypes.string.isRequired,
      firstAvailable: PropTypes.string.isRequired,
      nextAvailable: PropTypes.string.isRequired,
      reviewText: PropTypes.string,
    }),
  ).isRequired,
};

export default ProviderList;
