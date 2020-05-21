import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import ProfileInfoTable from '../ProfileInfoTable';

const EmailInformationSection = ({ className }) => (
  <div className={className}>
    <ProfileInfoTable
      title="Email address"
      data={[
        {
          title: 'Email address',
          value: 'kimwashington@yahoo.com',
        },
      ]}
      list
      className="vads-u-margin-y--4"
    />

    <AlertBox
      headline="Change the email address you use to sign in"
      backgroundOnly
      status="info"
    >
      <p>The first paragraph</p>
      <p>
        A much longer paragraph right here. A much longer paragraph right here.
        A much longer paragraph right here. A much longer paragraph right here.{' '}
      </p>
      <button className="va-button-link">Update email address on ID.me</button>
    </AlertBox>
  </div>
);

export default EmailInformationSection;
