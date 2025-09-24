import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import MhvSecondaryNav from '~/platform/mhv/secondary-nav/containers/MhvSecondaryNav';
import {
  isLOA3,
  isVAPatient,
  isProfileLoading,
} from '~/platform/user/selectors';
import recordEventFn from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

export const mhvUnauthorizedHeading = 'We can’t give you access to this page';
export const mhvUnauthorizedTitle = 'Unauthorized | Veterans Affairs';
export const mhvUnauthorizedTestId = 'mhv-unauthorized';
export const mhvUnauthorizedEvent = 'nav-403-error';

export const MhvUnauthorizedContent = ({
  recordEvent = recordEventFn,
} = {}) => {
  useEffect(() => recordEvent({ event: mhvUnauthorizedEvent }), [recordEvent]);

  useEffect(() => {
    document.title = mhvUnauthorizedTitle;
    focusElement('h1');
  }, []);

  return (
    <div className="vads-l-grid-container medium-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
      <div className="vads-l-row">
        <div
          className="vads-l-col--12 medium-screen:vads-l-col--8"
          data-testid={mhvUnauthorizedTestId}
        >
          <h1 className="vads-u-margin-top--4">{mhvUnauthorizedHeading}</h1>
          <p>
            If you typed or copied the URL into your web browser, check that
            it’s correct.
          </p>
          <p>
            If you think you should have access, call us at{' '}
            <va-telephone contact={CONTACTS.MY_HEALTHEVET} /> (
            <va-telephone contact={CONTACTS['711']} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </div>
      </div>
    </div>
  );
};

MhvUnauthorizedContent.propTypes = {
  recordEvent: PropTypes.func,
};

const MhvUnauthorized = () => {
  const isVerified = useSelector(isLOA3);
  const isAPatient = useSelector(isVAPatient);
  const loading = useSelector(isProfileLoading);

  if (loading) {
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          data-testid="mhv-unauthorized--loading"
          message="Please wait..."
        />
      </div>
    );
  }
  return (
    <>
      {isVerified && isAPatient && <MhvSecondaryNav />}
      <MhvUnauthorizedContent />
    </>
  );
};

export default MhvUnauthorized;
