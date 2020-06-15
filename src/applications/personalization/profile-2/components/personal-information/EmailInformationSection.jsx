import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import Email from 'vet360/components/VAPEmail';

import { signInServiceName as signInServiceNameSelector } from 'platform/user/authentication/selectors';

import ProfileInfoTable from '../ProfileInfoTable';

const EmailInformationSection = ({ className, signInServiceName }) => {
  let link;
  let buttonText;

  if (signInServiceName === 'idme') {
    link = 'https://wallet.id.me/settings';
    buttonText = 'ID.me';
  }

  if (signInServiceName === 'dslogon') {
    link = 'https://myaccess.dmdc.osd.mil/identitymanagement';
    buttonText = 'DS Logon';
  }

  if (signInServiceName === 'mhv') {
    link = 'https://www.myhealth.va.gov';
    buttonText = 'My HealtheVet';
  }

  return (
    <div className={className}>
      <ProfileInfoTable
        title="Contact email address"
        fieldName="emailAddress"
        data={[
          {
            value: (
              <>
                <p className="vads-u-margin-top--0">
                  This is the email we’ll use to contact you.
                </p>
                <p>
                  To update the email you use to sign in, go to the website
                  where you manage your log in information.
                </p>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  Update email address on {buttonText}
                </a>
              </>
            ),
          },
          {
            title: 'Contact email address',
            value: <Email />,
          },
        ]}
        list
        className="vads-u-margin-y--4"
      />
    </div>
  );
};

EmailInformationSection.propTypes = {
  className: PropTypes.string,
  signInServiceName: PropTypes.string.isRequired,
};

export const mapStateToProps = state => ({
  signInServiceName: signInServiceNameSelector(state),
});

export default connect(mapStateToProps)(EmailInformationSection);
