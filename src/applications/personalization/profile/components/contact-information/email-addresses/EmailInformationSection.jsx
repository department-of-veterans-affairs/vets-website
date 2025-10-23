import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  FIELD_IDS,
  FIELD_NAMES,
  FIELD_TITLES,
  FIELD_TITLE_DESCRIPTIONS,
} from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

import { signInServiceName as signInServiceNameSelector } from '~/platform/user/authentication/selectors';
import {
  SERVICE_PROVIDERS,
  CSP_IDS,
} from '~/platform/user/authentication/constants';

import { ProfileInfoSection } from '../../ProfileInfoSection';

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

const formatEmailTitle = title => title.replace('address', '').trim();

const generateRows = signInServiceName => {
  const { link, label: buttonText } =
    SERVICE_PROVIDERS[signInServiceName] || {};
  return [
    {
      title: formatEmailTitle(FIELD_TITLES[FIELD_NAMES.EMAIL]),
      description: FIELD_TITLE_DESCRIPTIONS[FIELD_NAMES.EMAIL],
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

// TODO: Why is this section sitting outside the other sections?
const EmailInformationSection = ({ className, signInServiceName }) => {
  return (
    <div className={className}>
      <ProfileInfoSection
        title="Email addresses"
        level={2}
        namedAnchor="email-address"
        data={generateRows(signInServiceName)}
        className="vads-u-margin-bottom--4"
        enableAlertConfirmEmail
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
