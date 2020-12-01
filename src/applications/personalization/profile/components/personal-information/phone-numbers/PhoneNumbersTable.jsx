import React from 'react';
import PropTypes from 'prop-types';

import ReceiveTextMessages from 'platform/user/profile/vap-svc/containers/ReceiveTextMessages.jsx';
import { FIELD_NAMES } from '@@vap-svc/constants';
import PhoneField from 'platform/user/profile/vap-svc/components/PhoneField/PhoneField';

import ProfileInfoTable from '../../ProfileInfoTable';

const PhoneNumbersTable = ({ className }) => (
  <ProfileInfoTable
    title="Phone numbers"
    data={[
      {
        value: <PhoneField fieldName={FIELD_NAMES.HOME_PHONE} title="Home" />,
      },
      {
        value: <PhoneField fieldName={FIELD_NAMES.WORK_PHONE} title="Work" />,
      },
      {
        value: (
          <>
            <PhoneField fieldName={FIELD_NAMES.MOBILE_PHONE} title="Mobile" />
            <ReceiveTextMessages
              fieldName={FIELD_NAMES.MOBILE_PHONE}
              title={'Mobile'}
            />
          </>
        ),
      },
      {
        value: <PhoneField fieldName={FIELD_NAMES.FAX_NUMBER} title="Fax" />,
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
