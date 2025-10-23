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

export const mhvPageNotFoundHeading = 'Page not found';
export const mhvPageNotFoundTitle = 'Page not found | Veterans Affairs';
export const mhvPageNotFoundTestId = 'mhv-page-not-found';
export const mhvPageNotFoundEvent = 'nav-404-error';

export const MhvPageNotFoundContent = ({
  recordEvent = recordEventFn,
} = {}) => {
  useEffect(() => recordEvent({ event: mhvPageNotFoundEvent }), [recordEvent]);

  useEffect(() => {
    document.title = mhvPageNotFoundTitle;
    focusElement('h1');
  }, []);

  return (
    <div data-testid={mhvPageNotFoundTestId}>
      <h1 className="vads-u-margin-top--4">{mhvPageNotFoundHeading}</h1>
      <p>
        If you typed or copied the URL into your web browser, check that it’s
        correct.
      </p>
      <p>If that doesn’t work, try going to the My HealtheVet homepage.</p>
      <p>
        <va-link
          href="/my-health"
          text="Go to the My HealtheVet on VA.gov homepage"
        />
      </p>
      <p className="vads-u-measure--4">
        If you still can’t find what you need, call us at{' '}
        <va-telephone contact={CONTACTS.MY_HEALTHEVET} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday; 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </div>
  );
};

MhvPageNotFoundContent.propTypes = {
  recordEvent: PropTypes.func,
};

/**
 * MhvPageNotFound component -- renders the 404 error page for applications
 * within the /my-health path.
 *
 * @component
 *
 * @example
 * // routes.jsx -- react-router-dom -- declare <MhvPageNotFound /> last within <Switch />
 * import { MhvPageNotFound } from '@department-of-veterans-affairs/mhv/exports';
 * <Switch>
 *   <Route exact path="/" key="App"><App/></Route>
 *   <Route><MhvPageNotFound /></Route>
 * </Switch>
 *
 * @example
 * // routes.jsx -- react-router-dom-v5-compat -- declare <MhvPageNotFound /> last within <Routes />
 * import { MhvPageNotFound } from '@department-of-veterans-affairs/mhv/exports';
 * <Routes>
 *   <Route path="/" element={<App />} />
 *   <Route path="*" element={<MhvPageNotFound />} />
 * </Routes>
 *
 * @example
 * // in _.unit.spec.jsx files:
 * // render a 404 condition
 * const { getByTestId } = render(<App />);
 * getByTestId('mhv-page-not-found');
 * // or, with chai assertions
 * const el = getByTestId('mhv-page-not-found');
 * expect(el).to.exist;
 *
 * @example
 * // in _.cypress.spec.js e2e files:
 * cy.visit('/nowhere');
 * cy.findByTestId('mhv-page-not-found');
 */
const MhvPageNotFound = () => {
  const isVerified = useSelector(isLOA3);
  const isAPatient = useSelector(isVAPatient);
  const loading = useSelector(isProfileLoading);

  if (loading) {
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          data-testid="mhv-page-not-found--loading"
          message="Please wait..."
        />
      </div>
    );
  }
  return (
    <>
      {isVerified && isAPatient && <MhvSecondaryNav />}
      <div className="vads-l-grid-container medium-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            <MhvPageNotFoundContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default MhvPageNotFound;
