import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { isBefore } from 'date-fns';
import {
  VaAlert,
  VaButton,
  VaLink,
  VaLinkAction,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectVAPContactInfo } from '@department-of-veterans-affairs/platform-user/selectors';

const COOKIE_NAME = 'MHV_EMAIL_CONFIRMATION_DISMISSED';
const dismissedAlert = () => Cookies.get(COOKIE_NAME);
export const dismissAlert = () =>
  Cookies.set(COOKIE_NAME, 'true', { expires: 365 });
export const resetDismissAlert = () => Cookies.remove(COOKIE_NAME);

const VA_PROFILE_EMAIL_HREF =
  '/profile/contact-information#contact-email-address';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7184-44682&t=CogySEDQUAcvZwHQ-4
const AlertConfirmContactEmail = ({ email }) => {
  return (
    <VaAlert
      status="warning"
      dataTestid="alert-confirm-contact-email"
      className="vads-u-margin-y--2"
    >
      <h2 slot="headline">Confirm your contact email</h2>
      <React.Fragment key=".1">
        <p>
          We’ll send notifications about your VA health care and benefits to
          this email.
        </p>
        <p className="vads-u-font-weight--bold">{email}</p>
        <p>
          <VaButton
            onClick={() => {}} // dispatch PUT ...
            fullWidth
            text="Confirm"
          />
        </p>
        <p className="vads-u-margin-bottom--0">
          <VaLink
            href={VA_PROFILE_EMAIL_HREF}
            text="Go to profile to update your contact email"
          />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertConfirmContactEmail.propTypes = {
  email: PropTypes.string.isRequired,
};

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7184-45009&t=CogySEDQUAcvZwHQ-4
const AlertAddContactEmail = () => {
  return (
    <VaAlert
      status="warning"
      dataTestid="alert-add-contact-email"
      className="vads-u-margin-y--2"
    >
      <h2 slot="headline">Add a contact email</h2>
      <React.Fragment key=".1">
        <p>
          We’ll send notifications about your VA health care and benefits to
          this email.
        </p>
        <p>
          <VaLinkAction
            type="primary-entry"
            href={VA_PROFILE_EMAIL_HREF}
            text="Go to profile to add a contact email"
          />
        </p>
        <p className="vads-u-margin-bottom--0">
          <VaButton secondary onClick={dismissAlert} text="Skip adding email" />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

export const EMAIL_CONFIRMATION_DATE_THRESHOLD =
  '2025-03-01T12:00:00.000+00:00';

const selectContactEmailConfirmationDate = state =>
  selectVAPContactInfo(state)?.email?.confirmationDate;

const selectContactEmailAddress = state =>
  selectVAPContactInfo(state)?.email?.emailAddress;

const showAlert = state =>
  !dismissedAlert() &&
  !state.featureToggles.loading &&
  state.featureToggles.mhvEmailConfirmation &&
  !state.user.profile.loading &&
  (!selectContactEmailAddress(state) ||
    !selectContactEmailConfirmationDate(state) ||
    isBefore(
      new Date(selectContactEmailConfirmationDate(state)),
      new Date(EMAIL_CONFIRMATION_DATE_THRESHOLD),
    ));

export const AlertConfirmEmail = () => {
  const renderAlert = useSelector(showAlert);
  const email = useSelector(selectContactEmailAddress);

  if (!renderAlert) return null;

  return email ? (
    <AlertConfirmContactEmail email={email} />
  ) : (
    <AlertAddContactEmail />
  );
};

export default AlertConfirmEmail;
