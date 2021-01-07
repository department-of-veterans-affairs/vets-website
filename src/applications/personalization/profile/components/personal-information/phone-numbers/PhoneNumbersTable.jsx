import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_NAMES } from '@@vap-svc/constants';

import ProfileInfoTable from '../../ProfileInfoTable';

import ContactInformationField from '~/applications/personalization/profile/components/personal-information/ContactInformationField';

const PhoneNumbersTable = ({ className }) => (
  <ProfileInfoTable
    title="Phone numbers"
    data={[
      {
        title: 'Home',
        value: <ContactInformationField fieldName={FIELD_NAMES.HOME_PHONE} />,
      },
      {
        title: 'Work',
        value: <ContactInformationField fieldName={FIELD_NAMES.WORK_PHONE} />,
      },
      {
        title: 'Mobile',
        value: <ContactInformationField fieldName={FIELD_NAMES.MOBILE_PHONE} />,
      },
      {
        title: 'Fax',
        value: <ContactInformationField fieldName={FIELD_NAMES.FAX_NUMBER} />,
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
