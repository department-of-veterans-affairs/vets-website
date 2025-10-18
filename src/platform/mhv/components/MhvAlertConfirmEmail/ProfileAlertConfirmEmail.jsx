import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaAlert,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  dismissAlertViaCookie,
  selectContactEmailAddress,
  showAlert,
} from './selectors';
import {
  AlertSystemResponseConfirmError,
  AlertSystemResponseConfirmSuccess,
  AlertSystemResponseSkipSuccess,
} from './AlertSystemResponse';
import { recordAlertLoadEvent } from './recordAlertLoadEvent';

// vap-svc imports
import {
  createTransaction,
  fetchTransactions,
} from 'src/platform/user/profile/vap-svc/actions';
import { FIELD_NAMES, API_ROUTES } from 'src/platform/user/profile/vap-svc/constants';

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45235&t=t55H62nbe7HYOvFq-4
const AlertConfirmContactEmail = ({ recordEvent, onClick }) => {
  const headline = 'Confirm your contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert status="warning" dataTestid="profile-alert--confirm-contact-email">
      <h2 slot="headline">{headline}</h2>
      <React.Fragment key=".1">
        <p>
          We’ll send notifications about your VA health care and benefits to
          this email.
        </p>
        <p>
          If your contact email below is correct, select
          <span className="vads-u-font-weight--bold">
            {' '}
            Confirm contact email
          </span>
          . If not, select{' '}
          <span className="vads-u-font-weight--bold"> Edit </span>
          to update your contact email.
        </p>
        <p>
          <VaButton text="Confirm contact email" onClick={() => onClick()} />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertConfirmContactEmail.propTypes = {
  recordEvent: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

// implements https://www.figma.com/design/CAChU51fWYMZsgDR5RXeSc/MHV-Landing-Page?node-id=7032-45893&t=t55H62nbe7HYOvFq-4
const AlertAddContactEmail = ({ recordEvent, onClick }) => {
  const headline = 'Add a contact email';

  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert status="warning" dataTestid="profile-alert--add-contact-email">
      <h2 slot="headline">{headline}</h2>
      <React.Fragment key=".1">
        <p>
          We’ll send notifications about your VA health care and benefits to
          this email.
        </p>
        <p>
          If you want to add a contact email address, select{' '}
          <span className="vads-u-font-weight--bold"> Add</span>. If you don’t
          want to add an email right now, you can select{' '}
          <span className="vads-u-font-weight--bold"> Skip adding email</span>.
        </p>
        <p>
          <VaButton
            text="Skip adding email"
            onClick={() => onClick()}
            secondary
          />
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertAddContactEmail.propTypes = {
  recordEvent: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
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
export const ProfileAlertConfirmEmail = ({ recordEvent = recordAlertLoadEvent }) => {
  const dispatch = useDispatch();
  const renderAlert = useSelector(showAlert);
  const emailAddress = useSelector(selectContactEmailAddress);

  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [skipSuccess, setSkipSuccess] = useState(false);

  /**
   * Use vap-svc createTransaction to update the confirmation date for the email.
   *
   * createTransaction(route, method, fieldName, payload, analyticsSectionName)
   * The vap API expects snake_case attribute names: email_address, confirmation_date
   *
   * Note: If your backend requires the email id in the URL (e.g. /profile/email_addresses/{id}),
   * you should change the route accordingly and remove the id from the payload.
   */
  const putConfirmationDate = (confirmationDate = new Date().toISOString()) => {
    // Build payload in the shape the vap API expects
    const payload = {
      emailAddress,
      confirmationDate,
    };

    // Use the vap-svc constants for route and field name
    const route = API_ROUTES.EMAILS; // '/profile/email_addresses'
    const method = 'PUT'; // original implementation used PUT

    // Dispatch the vap-svc transaction. createTransaction returns the transaction (or null).
    return dispatch(
      createTransaction(
        route,
        method,
        FIELD_NAMES.EMAIL,
        payload,
        'contact-information',
      ),
    )
      .then(response => {
        // createTransaction may return null (on failure), { formOnlyUpdate: true }, or a transaction object
        if (!response) {
          setConfirmError(true);
          return null;
        }

        // form-only update path: treat as success for the UI
        if (response.formOnlyUpdate) {
          setConfirmError(false);
          setConfirmSuccess(true);
          dismissAlertViaCookie();
          return response;
        }

        // Successful transaction creation (RECEIVED). Show success state and trigger a transactions fetch.
        setConfirmError(false);
        setConfirmSuccess(true);
        dismissAlertViaCookie();
        dispatch(fetchTransactions());
        return response;
      })
      .catch(() => {
        // Fallback error handling similar to original
        setConfirmError(true);
      });
  };

  const onSkipClick = () => {
    setSkipSuccess(true);
    dismissAlertViaCookie();
  };

  if (skipSuccess)
    return <AlertSystemResponseSkipSuccess recordEvent={recordEvent} />;

  if (!renderAlert) return null;

  return (
    <div className="vads-u-margin-top--1">
      {emailAddress ? (
        <>
          {confirmSuccess && (
            <AlertSystemResponseConfirmSuccess recordEvent={recordEvent} />
          )}
          {confirmError && (
            <AlertSystemResponseConfirmError recordEvent={recordEvent} />
          )}
          {!confirmSuccess && (
            <AlertConfirmContactEmail
              onClick={putConfirmationDate}
              recordEvent={recordEvent}
            />
          )}
        </>
      ) : (
        <>
          {!skipSuccess && (
            <AlertAddContactEmail
              onClick={onSkipClick}
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
