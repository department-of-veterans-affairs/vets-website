import React from 'react';
import PropTypes from 'prop-types';
import HomePhone from './fields/VAPHomePhone';
import WorkPhone from './fields/VAPWorkPhone';
import MobilePhone from './fields/VAPMobilePhone';
import FaxNumber from './fields/VAPFaxNumber';

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
