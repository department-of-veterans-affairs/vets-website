import React, { memo } from 'react';
import PropTypes from 'prop-types';

import PersonalInformationSection from './PersonalInformationSection';
import LoadFail from '../alerts/LoadFail';

const PersonalInformationContent = ({ hasPersonalInformationServiceError }) => (
  <>
    {hasPersonalInformationServiceError ? (
      <LoadFail />
    ) : (
      <PersonalInformationSection />
    )}
  </>
);

PersonalInformationContent.propTypes = {
  hasPersonalInformationServiceError: PropTypes.bool,
};

export default memo(PersonalInformationContent);
