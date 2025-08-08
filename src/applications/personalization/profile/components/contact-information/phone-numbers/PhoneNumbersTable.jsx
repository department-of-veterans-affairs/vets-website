import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

import { ProfileInfoSection } from '../../ProfileInfoSection';

const PhoneNumbersTable = ({ className }) => {
  const rows = [
    {
      title: 'Home',
      id: FIELD_IDS[FIELD_NAMES.HOME_PHONE],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.HOME_PHONE}
          allowInternationalPhones
        />
      ),
    },
    {
      title: 'Mobile',
      id: FIELD_IDS[FIELD_NAMES.MOBILE_PHONE],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.MOBILE_PHONE}
          allowInternationalPhones
        />
      ),
    },
    {
      title: 'Work',
      id: FIELD_IDS[FIELD_NAMES.WORK_PHONE],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.WORK_PHONE}
          allowInternationalPhones
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
