import React from 'react';
import PropTypes from 'prop-types';

import { benefitTypes } from '~/applications/personalization/common/constants';

const DirectDepositConnectionError = ({ benefitType }) => {
  let headline;
  let content;
  switch (benefitType) {
    case benefitTypes.CNP:
      headline =
        'We can’t load disability compensation and pension information';
      content = (
        <p className="vads-u-margin-bottom--0">
          We’re sorry. Something went wrong on our end. We are having trouble
          loading information about disability compensation and pension
          benefits. Please refresh this page or try again later.
        </p>
      );
      break;

    case benefitTypes.EDU:
      headline = 'We can’t load education benefits information';
      content = (
        <p className="vads-u-margin-bottom--0">
          We’re sorry. Something went wrong on our end. We are having trouble
          loading information about education benefits. Please refresh this page
          or try again later.
        </p>
      );
      break;

    default:
      break;
  }

  return (
    <va-alert
      class="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4"
      status="warning"
      uswds
    >
      <h3 slot="headline">{headline}</h3>

      {content}
    </va-alert>
  );
};

// add prop types for the component
DirectDepositConnectionError.propTypes = {
  benefitType: PropTypes.string.isRequired,
};

export default DirectDepositConnectionError;
