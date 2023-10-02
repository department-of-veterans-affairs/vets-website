import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLastLocation } from 'react-router-last-location';
import { PROFILE_PATHS } from 'applications/personalization/profile/constants';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';
import { selectVAPContactInfoField } from 'platform/user/profile/vap-svc/selectors';

import { focusElement } from 'platform/utilities/ui';

const ContactInformationUpdateSuccessAlert = ({ fieldName }) => {
  const fieldData = useSelector(state => {
    return selectVAPContactInfoField(state, fieldName);
  });
  const referrer = useLastLocation();
  const id = `${fieldName}-alert`;
  const useLink =
    !!fieldData &&
    (referrer?.pathname === PROFILE_PATHS.NOTIFICATION_SETTINGS ||
      document.referrer?.endsWith(PROFILE_PATHS.NOTIFICATION_SETTINGS)) &&
    fieldName === FIELD_NAMES.MOBILE_PHONE;

  useEffect(
    () => {
      const editButton = document
        .querySelector(`[data-field-name=${fieldName}]`)
        ?.querySelector("[data-action='edit']");
      if (editButton) {
        focusElement(editButton);
      }
    },

    [fieldName, id, useLink],
  );
  const message = React.useMemo(
    () => {
      if (useLink) {
        return (
          <>
            Update saved. Now you can{' '}
            <Link
              to={{
                pathname: PROFILE_PATHS.NOTIFICATION_SETTINGS,
                state: { scrollToTop: true },
              }}
            >
              manage text notifications
            </Link>
            .
          </>
        );
      }
      return 'Update saved.';
    },
    [useLink],
  );

  return (
    <>
      <va-alert
        background-only
        class="vads-u-margin-y--1"
        close-btn-aria-label="Close notification"
        disable-analytics="false"
        show-icon
        status="success"
        visible="true"
      >
        <div
          className="vads-u-display--flex vads-u-margin-left--neg1p5"
          id={id}
        >
          <p className="vads-u-margin-y--0" role="alert" aria-live="polite">
            {message}
          </p>
        </div>
      </va-alert>
    </>
  );
};

ContactInformationUpdateSuccessAlert.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default ContactInformationUpdateSuccessAlert;
