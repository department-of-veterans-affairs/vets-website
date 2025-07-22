import React from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

import { ProfileInfoSection } from '../../ProfileInfoSection';

const PhoneNumbersTable = ({ className }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(
    TOGGLE_NAMES.profileInternationalPhoneNumbers,
  );

  const rows = [
    {
      title: 'Home',
      id: FIELD_IDS[FIELD_NAMES.HOME_PHONE],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.HOME_PHONE}
          allowInternationalPhones={toggleValue}
        />
      ),
    },
    {
      title: 'Mobile',
      id: FIELD_IDS[FIELD_NAMES.MOBILE_PHONE],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.MOBILE_PHONE}
          allowInternationalPhones={toggleValue}
        />
      ),
    },
    {
      title: 'Work',
      id: FIELD_IDS[FIELD_NAMES.WORK_PHONE],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.WORK_PHONE}
          allowInternationalPhones={toggleValue}
        />
      ),
    },
  ];

  return (
    <ProfileInfoSection
      title="Phone numbers"
      level={2}
      namedAnchor="phone-numbers"
      data={rows}
      className={className}
    />
  );
};

PhoneNumbersTable.propTypes = {
  className: PropTypes.string,
};

export default PhoneNumbersTable;
