import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import { benefitTypes } from '../direct-deposit/DirectDepositV2';

const DirectDepositConnectionError = ({ benefitType }) => {
  let headline;
  let content;
  switch (benefitType) {
    case benefitTypes.CNP:
      headline =
        'We can’t load disability compensation and pension information';
      content = (
        <p>
          We’re sorry. Something went wrong on our end. We are having trouble
          loading information about disability compensation and pension
          benefits. Please refresh this page or try again later.
        </p>
      );
      break;

    case benefitTypes.EDU:
      headline = 'We can’t load education benefits information';
      content = (
        <p>
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
    <div className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4">
      <AlertBox headline={headline} content={content} status="warning" />
    </div>
  );
};

export default DirectDepositConnectionError;
