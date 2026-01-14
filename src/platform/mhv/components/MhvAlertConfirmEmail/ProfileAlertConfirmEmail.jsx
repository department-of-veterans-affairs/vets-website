import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  VaAlert,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { openModal } from 'platform/user/profile/vap-svc/actions/index';
import {
  dismissAlertViaCookie,
  selectContactEmailAddress,
  selectContactEmailAddressId,
  showAlert,
} from './selectors';
import {
  AlertSystemResponseConfirmSuccess,
  AlertSystemResponseSkipSuccess,
} from './AlertSystemResponse';
import { recordAlertLoadEvent } from './recordAlertLoadEvent';
import { ProfileAlertConfirmEmailContent } from './ProfileAlertConfirmEmailContent';
import useConfirmEmailTransaction from '../../hooks/useConfirmEmailTransaction';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45235&t=t55H62nbe7HYOvFq-4
const AlertConfirmContactEmail = ({
  emailAddress,
  isConfirming,
  onConfirmClick,
  onEditClick,
  recordEvent,
}) => {
  const headline = 'Confirm your contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert
      status="warning"
      role="status"
      dataTestid="profile-alert--confirm-contact-email"
    >
      <h3 slot="headline">
        <span className="usa-sr-only">warning</span>
        {headline}
      </h3>
      <ProfileAlertConfirmEmailContent
        emailAddress={emailAddress}
        isConfirming={isConfirming}
        onConfirmClick={() => {
          onConfirmClick();
        }}
        onEditClick={onEditClick}
      />
    </VaAlert>
  );
};

AlertConfirmContactEmail.propTypes = {
  emailAddress: PropTypes.string.isRequired,
  recordEvent: PropTypes.func.isRequired,
  isConfirming: PropTypes.bool,
  onConfirmClick: PropTypes.func,
  onEditClick: PropTypes.func,
};

/**
 * This component is very similar to AlertConfirmContactEmail (above), but is slightly modified
 * to indicate an error state.
 */
const AlertConfirmContactEmailError = ({
  emailAddress,
  isConfirming,
  onConfirmClick,
  onEditClick,
  recordEvent,
}) => {
  const headline = 'We couldn’t confirm your contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert status="error" role="alert" dataTestid="mhv-alert--confirm-error">
      <h3 slot="headline">
        <span className="usa-sr-only">error</span>
        {headline}
      </h3>
      <p>Please try again.</p>
      <ProfileAlertConfirmEmailContent
        emailAddress={emailAddress}
        isConfirming={isConfirming}
        onConfirmClick={() => {
          onConfirmClick();
        }}
        onEditClick={onEditClick}
      />
    </VaAlert>
  );
};

AlertConfirmContactEmailError.propTypes = {
  emailAddress: PropTypes.string.isRequired,
  recordEvent: PropTypes.func.isRequired,
  isConfirming: PropTypes.bool,
  onConfirmClick: PropTypes.func,
  onEditClick: PropTypes.func,
};

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45893&t=t55H62nbe7HYOvFq-4
const AlertAddContactEmail = ({ recordEvent, onAddClick, onSkipClick }) => {
  const headline = 'Add a contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert
      status="warning"
      role="status"
      dataTestid="profile-alert--add-contact-email"
    >
      <h3 slot="headline">{headline}</h3>
      <React.Fragment key=".1">
        <p>
          We’ll send notifications about your VA health care and benefits to
          this email.
        </p>
        <p
          className="vads-u-font-weight--bold"
          style={{ wordBreak: 'break-word' }}
        >
          No contact email provided
        </p>
        <VaButtonPair
          onPrimaryClick={onAddClick}
          onSecondaryClick={onSkipClick}
          leftButtonText="Add a contact email"
          rightButtonText="Skip adding an email"
        />
      </React.Fragment>
    </VaAlert>
  );
};

AlertAddContactEmail.propTypes = {
  recordEvent: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onSkipClick: PropTypes.func.isRequired,
};

/**
 * `<ProfileAlertConfirmEmail />` component
 *
 * Alert to confirm or add a contact email address at the `/profile/contact-information` path
 *
 * To view specification, run:
 *   `yarn test:unit src/platform/mhv/tests/components/ProfileAlertConfirmEmail.unit.spec.jsx --reporter=spec`
 *
 * @returns {JSX.Element|null}
 */
const ProfileAlertConfirmEmail = ({ recordEvent = recordAlertLoadEvent }) => {
  const renderAlert = useSelector(showAlert);
  const emailAddress = useSelector(selectContactEmailAddress);
  const emailAddressId = useSelector(selectContactEmailAddressId);

  const dispatch = useDispatch();
  const handleEditEmail = () => dispatch(openModal('email'));

  const [skipSuccess, setSkipSuccess] = useState(false);

  const {
    confirmEmail,
    isLoading,
    isSuccess: confirmSuccess,
    isError: confirmError,
  } = useConfirmEmailTransaction({
    emailAddressId,
    emailAddress,
    onSuccess: () => dismissAlertViaCookie(),
  });

  useEffect(
    () => {
      if (confirmSuccess) {
        waitForRenderThenFocus('[data-testid="mhv-alert--confirm-success"]');
      } else if (confirmError) {
        waitForRenderThenFocus('[data-testid="mhv-alert--confirm-error"]');
      } else if (skipSuccess) {
        waitForRenderThenFocus('[data-testid="mhv-alert--skip-success"]');
      }
    },
    [confirmSuccess, confirmError, skipSuccess],
  );

  const onSkipClick = () => {
    setSkipSuccess(true);
    dismissAlertViaCookie();
  };

  if (skipSuccess)
    return (
      <AlertSystemResponseSkipSuccess
        recordEvent={recordEvent}
        tabIndex={-1}
        headingLevel="h3"
      />
    );

  if (!renderAlert) return null;

  return (
    <div className="vads-u-margin-top--1">
      {emailAddress ? (
        <>
          {confirmSuccess && (
            <AlertSystemResponseConfirmSuccess
              recordEvent={recordEvent}
              tabIndex={-1}
              headingLevel="h3"
            />
          )}
          {confirmError && (
            <AlertConfirmContactEmailError
              emailAddress={emailAddress}
              isConfirming={isLoading}
              onConfirmClick={confirmEmail}
              onEditClick={handleEditEmail}
              recordEvent={recordEvent}
            />
          )}
          {!confirmSuccess &&
            !confirmError && (
              <AlertConfirmContactEmail
                emailAddress={emailAddress}
                isConfirming={isLoading}
                onConfirmClick={confirmEmail}
                onEditClick={handleEditEmail}
                recordEvent={recordEvent}
              />
            )}
        </>
      ) : (
        <>
          {!skipSuccess && (
            <AlertAddContactEmail
              onAddClick={handleEditEmail}
              onSkipClick={onSkipClick}
              recordEvent={recordEvent}
            />
          )}
        </>
      )}
    </div>
  );
};

ProfileAlertConfirmEmail.propTypes = {
  recordEvent: PropTypes.func,
};

export default ProfileAlertConfirmEmail;
