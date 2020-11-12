import React from 'react';
import PropTypes from 'prop-types';
import HomePhone from './HomePhone';
import WorkPhone from './WorkPhone';
import MobilePhone from './MobilePhone';
import FaxNumber from './FaxNumber';

import ProfileInfoTable from '../../ProfileInfoTable';

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
