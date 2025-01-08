import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { useSelector } from 'react-redux';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NeedHelp from '../../components/NeedHelp';
import ErrorBoundary from '../../components/ErrorBoundary';
import WarningNotification from '../../components/WarningNotification';
import { selectCurrentPage } from '../redux/selectors';
import { routeToPreviousReferralPage } from '../flow';
import ErrorAlert from './ErrorAlert';

function BreadCrumbNav() {
  const history = useHistory();
  const currentPage = useSelector(selectCurrentPage);

  const text =
    currentPage === 'referralsAndRequests' || currentPage === 'scheduleReferral'
      ? 'Appointments'
      : 'Back';
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  return (
    <div className="vaos-hide-for-print mobile:vads-u-margin-bottom--0 mobile-lg:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2">
      <nav aria-label="backlink" className="vads-u-padding-y--2 ">
        <VaLink
          back
          aria-label="Back link"
          href="#"
          text={text}
          onClick={e => {
            e.preventDefault();
            routeToPreviousReferralPage(history, currentPage, id);
          }}
        />
      </nav>
    </div>
  );
}

export default function ReferralLayout({
  children,
  hasEyebrow,
  apiFailure,
  heading,
}) {
  const location = useLocation();

  return (
    <>
      <div className="vads-l-grid-container vads-u-padding-x--2p5 desktop-lg:vads-u-padding-x--0 vads-u-padding-bottom--2">
        <BreadCrumbNav />
        {location.pathname.endsWith('new-appointment') && (
          <DowntimeNotification
            appTitle="VA online scheduling tool"
            dependencies={[externalServices.vaosWarning]}
            render={(props, childContent) => (
              <WarningNotification {...props}>
                {childContent}
              </WarningNotification>
            )}
          />
        )}
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            {hasEyebrow && (
              <>
                <span className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal">
                  New Appointment
                </span>
                {heading && (
                  <h1 data-testid="referral-layout-heading">{heading}</h1>
                )}
              </>
            )}
            <ErrorBoundary>
              {apiFailure ? <ErrorAlert /> : children}
            </ErrorBoundary>
            <NeedHelp />
          </div>
        </div>
      </div>
    </>
  );
}

ReferralLayout.propTypes = {
  apiFailure: PropTypes.bool,
  children: PropTypes.node,
  hasEyebrow: PropTypes.bool,
  heading: PropTypes.string,
};
