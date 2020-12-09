import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';
import PhoneField from './PhoneField';
import ProfileInfoTable from '../../ProfileInfoTable';

const PhoneNumbersTable = ({ className }) => (
  <ProfileInfoTable
    title="Phone numbers"
    data={[
      {
        title: 'Home',
        value: (
          <PhoneField
            title={FIELD_TITLES[FIELD_NAMES.HOME_PHONE]}
            fieldName={FIELD_NAMES.HOME_PHONE}
          />
        ),
      },
      {
        title: 'Work',
        value: (
          <PhoneField
            title={FIELD_TITLES[FIELD_NAMES.WORK_PHONE]}
            fieldName={FIELD_NAMES.WORK_PHONE}
          />
        ),
      },
      {
        title: 'Mobile',
        value: (
          <PhoneField
            title={FIELD_TITLES[FIELD_NAMES.MOBILE_PHONE]}
            fieldName={FIELD_NAMES.MOBILE_PHONE}
          />
        ),
      },
      {
        title: 'Fax',
        value: (
          <PhoneField
            title={FIELD_TITLES[FIELD_NAMES.FAX_NUMBER]}
            fieldName={FIELD_NAMES.FAX_NUMBER}
          />
        ),
      },
    ]}
    list
    className={className}
  />
);

PhoneNumbersTable.propTypes = {
  className: PropTypes.string,
};

export default PhoneNumbersTable;
