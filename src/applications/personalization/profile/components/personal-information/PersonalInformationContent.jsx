import React, { memo } from 'react';
import PropTypes from 'prop-types';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';

import PersonalInformationSection from './PersonalInformationSection';

const PersonalInformationContent = ({
  hasVAPServiceError,
  hasPersonalInformationServiceError,
}) => (
  <>
    {hasVAPServiceError || hasPersonalInformationServiceError ? (
      <div data-testid="vap-service-not-available-error">
        <va-alert status="warning" className="vads-u-margin-bottom--4">
          <h2 slot="headline">We can’t load your personal information</h2>
          <p>
            We’re sorry. Something went wrong on our end. We can’t display your
            personal information. Please refresh the page or try again later.
          </p>
        </va-alert>
      </div>
    ) : (
      <InitializeVAPServiceID>
        <PersonalInformationSection />
      </InitializeVAPServiceID>
    )}
  </>
);

PersonalInformationContent.propTypes = {
  hasVAPServiceError: PropTypes.bool,
  hasPersonalInformationServiceError: PropTypes.bool,
};

export default memo(PersonalInformationContent);
