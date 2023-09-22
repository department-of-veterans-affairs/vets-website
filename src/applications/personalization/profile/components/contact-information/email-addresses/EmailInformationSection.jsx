import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import React from 'react';

import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

import { signInServiceName as signInServiceNameSelector } from '~/platform/user/authentication/selectors';
import {
  SERVICE_PROVIDERS,
  CSP_IDS,
} from '~/platform/user/authentication/constants';

import { ProfileInfoCard } from '../../ProfileInfoCard';

/**
 * only id.me and login.gov use email for sign in / show the sign-in email section.
 * See issue [#47070](https://github.com/department-of-veterans-affairs/va.gov-team/issues/47070)
 *
 * @param {string} signInServiceName - sign in service from CSP_IDS
 * @returns {boolean} true if the sign in service uses email
 */
const signInServiceUsesEmail = signInServiceName => {
  const servicesUsingEmailSignIn = [CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV];
  return servicesUsingEmailSignIn.includes(signInServiceName);
};

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
    ...(signInServiceUsesEmail(signInServiceName)
      ? [
          {
            title: 'Sign-in email',
            value: (
              <>
                <span>
                  The email you use to sign in to VA.gov may be different from
                  your contact email.
                </span>
                <p>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="sign-in-email-link"
                  >
                    {`View or edit your sign-in email at ${buttonText}`}
                  </a>
                </p>
              </>
            ),
          },
        ]
      : []),
  ];
};

const EmailInformationSection = ({ className, signInServiceName }) => {
  return (
    <div className={className}>
      <ProfileInfoCard
        title="Email addresses"
        level={2}
        namedAnchor="email-address"
        data={generateRows(signInServiceName)}
        className="vads-u-margin-y--4"
      />
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
