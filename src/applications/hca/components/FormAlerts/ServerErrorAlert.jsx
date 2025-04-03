import React from 'react';
import PropTypes from 'prop-types';

const ServerErrorAlert = ({
  headline = 'Something went wrong on our end',
  description = 'We’re sorry. Something went wrong on our end. Please try again.',
}) => (
  <va-alert status="error" data-testid="hca-server-error-alert" uswds>
    <h2 slot="headline">{headline}</h2>
    <p>{description}</p>
  </va-alert>
);

ServerErrorAlert.propTypes = {
  headline: PropTypes.string,
  description: PropTypes.string,
};

export default React.memo(ServerErrorAlert);
