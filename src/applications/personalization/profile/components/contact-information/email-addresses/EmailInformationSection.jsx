import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import React from 'react';

import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

import { signInServiceName as signInServiceNameSelector } from '~/platform/user/authentication/selectors';
import { SERVICE_PROVIDERS } from '~/platform/user/authentication/constants';

import ProfileInfoTable from '../../ProfileInfoTable';
import { ProfileInfoCard } from '../../ProfileInfoCard';
import { Toggler } from '~/platform/utilities/feature-toggles';

const generateRows = signInServiceName => {
  const { link, label: buttonText } =
    SERVICE_PROVIDERS[signInServiceName] || {};
  return [
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
      value: (
        <ProfileInformationFieldController fieldName={FIELD_NAMES.EMAIL} />
      ),
    },
    {
      title: 'Sign-in email',
      value: (
        <>
          <span>
            The email you use to sign in to VA.gov may be different from your
            contact email.
          </span>
          <p>
            <a href={link} target="_blank" rel="noopener noreferrer">
              View or edit your sign-in email at {buttonText}
            </a>
          </p>
        </>
      ),
    },
  ];
};

const EmailInformationSection = ({ className, signInServiceName }) => {
  return (
    <div className={className}>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseInfoCard}>
        <Toggler.Enabled>
          <ProfileInfoCard
            title="Email addresses"
            level={2}
            namedAnchor="email-address"
            data={generateRows(signInServiceName)}
            className="vads-u-margin-y--4"
          />
        </Toggler.Enabled>
        <Toggler.Disabled>
          <ProfileInfoTable
            title="Email addresses"
            fieldName="emailAddress"
            namedAnchor="email-address"
            level={2}
            data={generateRows(signInServiceName)}
            className="vads-u-margin-y--4"
          />
        </Toggler.Disabled>
      </Toggler>
    </div>
  );
};

EmailInformationSection.propTypes = {
  signInServiceName: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export const mapStateToProps = state => ({
  signInServiceName: signInServiceNameSelector(state),
});

export default connect(mapStateToProps)(EmailInformationSection);
