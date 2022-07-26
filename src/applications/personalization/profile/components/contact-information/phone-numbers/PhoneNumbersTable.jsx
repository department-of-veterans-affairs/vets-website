import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

import ProfileInfoTable from '../../ProfileInfoTable';

const PhoneNumbersTable = ({ className }) => {
  const tableFields = [
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
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.MOBILE_PHONE}
        />
      ),
    },
  ];

  return (
    <ProfileInfoTable
      title="Phone numbers"
      level={2}
      namedAnchor="phone-numbers"
      data={tableFields}
      className={className}
    />
  );
};

PhoneNumbersTable.propTypes = {
  className: PropTypes.string,
};

export default PhoneNumbersTable;
