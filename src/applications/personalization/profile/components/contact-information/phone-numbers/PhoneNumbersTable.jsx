import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ContactInformationField from '@@vap-svc/components/ContactInformationField';

import ProfileInfoTable from '../../ProfileInfoTable';

const PhoneNumbersTable = ({ className }) => (
  <ProfileInfoTable
    title="Phone numbers"
    level={2}
    namedAnchor="phone-numbers"
    data={[
      {
        title: 'Home',
        id: FIELD_IDS[FIELD_NAMES.HOME_PHONE],
        value: <ContactInformationField fieldName={FIELD_NAMES.HOME_PHONE} />,
      },
      {
        title: 'Work',
        id: FIELD_IDS[FIELD_NAMES.WORK_PHONE],
        value: <ContactInformationField fieldName={FIELD_NAMES.WORK_PHONE} />,
      },
      {
        title: 'Mobile',
        id: FIELD_IDS[FIELD_NAMES.MOBILE_PHONE],
        value: <ContactInformationField fieldName={FIELD_NAMES.MOBILE_PHONE} />,
      },
      {
        title: 'Fax',
        id: FIELD_IDS[FIELD_NAMES.FAX_NUMBER],
        value: <ContactInformationField fieldName={FIELD_NAMES.FAX_NUMBER} />,
      },
    ]}
    className={className}
  />
);

PhoneNumbersTable.propTypes = {
  className: PropTypes.string,
};

export default PhoneNumbersTable;
