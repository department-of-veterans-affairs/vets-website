import React from 'react';
import PropTypes from 'prop-types';
import HomePhone from './VAPHomePhone';
import WorkPhone from './VAPWorkPhone';
import MobilePhone from './VAPMobilePhone';
import FaxNumber from './VAPFaxNumber';

import ProfileInfoTable from '../ProfileInfoTable';

const PhoneNumbersTable = ({ className }) => (
  <ProfileInfoTable
    title="Phone numbers"
    data={[
      {
        title: 'Home',
        value: <HomePhone />,
      },
      {
        title: 'Work',
        value: <WorkPhone />,
      },
      {
        title: 'Mobile',
        value: <MobilePhone />,
      },
      {
        title: 'Fax',
        value: <FaxNumber />,
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
