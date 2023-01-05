import React, { memo } from 'react';
import PropTypes from 'prop-types';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';

import PersonalInformationSection from './PersonalInformationSection';
import LoadFail from '../alerts/LoadFail';

const PersonalInformationContent = ({ hasPersonalInformationServiceError }) => (
  <>
    {hasPersonalInformationServiceError ? (
      <LoadFail />
    ) : (
      <InitializeVAPServiceID>
        <PersonalInformationSection />
      </InitializeVAPServiceID>
    )}
  </>
);

PersonalInformationContent.propTypes = {
  hasPersonalInformationServiceError: PropTypes.bool,
};

export default memo(PersonalInformationContent);
