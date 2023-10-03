import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

import { ProfileInfoCard } from '../../ProfileInfoCard';

const rows = [
  {
    title: 'Home',
    id: FIELD_IDS[FIELD_NAMES.HOME_PHONE],
    value: (
      <ProfileInformationFieldController fieldName={FIELD_NAMES.HOME_PHONE} />
    ),
  },
  {
    title: 'Work',
    id: FIELD_IDS[FIELD_NAMES.WORK_PHONE],
    value: (
      <ProfileInformationFieldController fieldName={FIELD_NAMES.WORK_PHONE} />
    ),
  },
  {
    title: 'Mobile',
    id: FIELD_IDS[FIELD_NAMES.MOBILE_PHONE],
    value: (
      <ProfileInformationFieldController fieldName={FIELD_NAMES.MOBILE_PHONE} />
    ),
  },
];

const PhoneNumbersTable = ({ className }) => {
  return (
    <ProfileInfoCard
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
