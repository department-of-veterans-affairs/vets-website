import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLastLocation } from 'react-router-last-location';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import { PROFILE_PATHS } from '@@profile/constants';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { selectVAPContactInfoField } from '@@vap-svc/selectors';

import environment from '~/platform/utilities/environment';

const ContactInformationUpdateSuccessAlert = ({ fieldName }) => {
  const fieldData = useSelector(state => {
    return selectVAPContactInfoField(state, fieldName);
  });
  const referrer = useLastLocation();
  const message = React.useMemo(
    () => {
      if (
        !!fieldData &&
        referrer?.pathname === PROFILE_PATHS.NOTIFICATION_SETTINGS &&
        fieldName === FIELD_NAMES.MOBILE_PHONE
      ) {
        return (
          <>
            Update saved. Now you can{' '}
            <Link to={PROFILE_PATHS.NOTIFICATION_SETTINGS}>
              manage text notifications
            </Link>
            .
          </>
        );
      }
      return 'Update saved.';
    },
    [fieldName, referrer],
  );

  if (environment.isProduction()) {
    return null;
  }

  return (
    <AlertBox backgroundOnly status="success" className="vads-u-margin-y--1">
      <div className="vads-u-display--flex">
        <i
          aria-hidden="true"
          className="fa fa-check-circle vads-u-padding-top--0p5 vads-u-margin-right--1"
        />
        <p className="vads-u-margin-y--0" role="alert" aria-live="polite">
          {message}
        </p>
      </div>
    </AlertBox>
  );
};

export default ContactInformationUpdateSuccessAlert;
