import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as VAP_SERVICE from '../constants';
import { selectVAPContactInfoField } from '../selectors';
import { createTransaction } from '../actions';

/**
 * ConfirmEmailButton
 *
 * This button will set the `confirmationDate` on the user's VAP email object
 * and dispatch the existing `createTransaction` action so the update flows
 * through the project's transaction and error handling.
 *
 * Notes:
 * - `state.user.profile.vapContactInfo.email` is an object (not an array).
 * - The component will merge `confirmationDate` into that object and send
 *   a PUT (if id is present) or POST (if no id) to the EMAILS API route.
 */
export default function ConfirmEmailButton({
  className = '',
  children = 'Confirm email',
  onSuccess,
  onError,
  apiAction,
  disabled: disabledProp = false,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const emailObject = useSelector(state =>
    selectVAPContactInfoField(state, VAP_SERVICE.FIELD_NAMES.EMAIL),
  );

  const handleClick = async () => {
    if (!emailObject) {
      const err = new Error('No email object found in profile.vapContactInfo');
      if (onError) onError(err);
      return;
    }

    if (loading) return;
    setLoading(true);

    const confirmationDate = new Date().toISOString();

    // Merge confirmationDate into the existing email object. Keep other
    // properties so the API can identify which resource to update.
    const payload = {
      ...emailObject,
      confirmationDate,
    };

    const apiRoute = VAP_SERVICE.API_ROUTES.EMAILS;
    const fieldName = VAP_SERVICE.FIELD_NAMES.EMAIL;
    const method = payload.id ? 'PUT' : 'POST';
    const analyticsSectionName = VAP_SERVICE.ANALYTICS_FIELD_MAP[fieldName];

    try {
      if (typeof apiAction === 'function') {
        // use caller-provided API action (keeps older components working)
        await apiAction(confirmationDate);
        if (onSuccess) onSuccess(null, confirmationDate);
      } else {
        const transaction = await dispatch(
          createTransaction(
            apiRoute,
            method,
            fieldName,
            payload,
            analyticsSectionName,
          ),
        );

        // createTransaction returns the transaction object on success, or null
        // on failure. Treat null as a failed request.
        if (transaction) {
          if (onSuccess) onSuccess(transaction, confirmationDate);
        } else {
          const err = new Error('Transaction creation failed');
          if (onError) onError(err);
        }
      }
    } catch (error) {
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!emailObject) return null;

  return (
    <va-button
      text={loading ? 'Confirming…' : children}
      onClick={handleClick}
      class={className}
      disabled={loading || disabledProp}
      loading={loading}
      aria-label="Set confirmation date for this email"
    />
  );
}

ConfirmEmailButton.propTypes = {
  apiAction: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};
