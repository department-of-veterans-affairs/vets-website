import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import React from 'react';

import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ContactInformationField from '@@vap-svc/components/ContactInformationField';

import { signInServiceName as signInServiceNameSelector } from 'platform/user/authentication/selectors';

import ProfileInfoTable from '../../ProfileInfoTable';

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

  if (signInServiceName === 'mhv' || signInServiceName === 'myhealthevet') {
    link = 'https://www.myhealth.va.gov';
    buttonText = 'My HealtheVet';
  }

  return (
    <div className={className}>
      <ProfileInfoTable
        title="Email addresses"
        fieldName="emailAddress"
        namedAnchor="email-address"
        level={2}
        data={[
          {
            title: (
              <>
                Contact email
                <span className="vads-u-color--gray-medium vads-u-display--block vads-u-font-weight--normal">
                  We use this email to send you information.
                </span>
              </>
            ),
            id: FIELD_IDS[FIELD_NAMES.EMAIL],
            value: <ContactInformationField fieldName={FIELD_NAMES.EMAIL} />,
          },
          {
            title: 'Sign-in email',
            value: (
              <>
                <span>
                  The email you use to sign in to VA.gov may be different from
                  your contact email.
                </span>
                <p>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    View or edit your sign-in email at {buttonText}
                  </a>
                </p>
              </>
            ),
          },
        ]}
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
