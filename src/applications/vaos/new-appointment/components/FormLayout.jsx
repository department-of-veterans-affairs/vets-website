import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { useDispatch, useSelector } from 'react-redux';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Breadcrumbs from '../../components/Breadcrumbs';
import NeedHelp from '../../components/NeedHelp';
import ErrorBoundary from '../../components/ErrorBoundary';
import WarningNotification from '../../components/WarningNotification';
import { getFlowType, getFormData } from '../redux/selectors';
import { FACILITY_TYPES, FLOW_TYPES } from '../../utils/constants';
import { routeToPreviousAppointmentPage } from '../redux/actions';
import { selectFeatureImmediateCareAlert } from '../../redux/selectors';

function Title() {
  const flowType = useSelector(getFlowType);
  const formData = useSelector(getFormData);

  if (FLOW_TYPES.REQUEST === flowType) {
    if (FACILITY_TYPES.COMMUNITY_CARE.id === formData.facilityType) {
      return 'Request community care';
    }

    return 'Request an appointment';
  }

  return 'New appointment';
}

function BackLink() {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageKey = useSelector(state => state?.newAppointment?.currentPageKey);

  return (
    <div className="vaos-hide-for-print mobile:vads-u-margin-bottom--0 mobile-lg:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2">
      <nav aria-label="backlink" className="vads-u-padding-y--2 ">
        <VaLink
          back
          aria-label="Back link"
          href="#"
          text="Back"
          onClick={e => {
            e.preventDefault();
            dispatch(routeToPreviousAppointmentPage(history, pageKey));
          }}
        />
      </nav>
    </div>
  );
}

function Nav({ pageTitle }) {
  const location = useLocation();
  const featureImmediateCareAlert = useSelector(
    selectFeatureImmediateCareAlert,
  );

  if (featureImmediateCareAlert && location.pathname === '/schedule')
    return (
      <Breadcrumbs>
        <a href="/my-health/appointments/schedule">{pageTitle}</a>
      </Breadcrumbs>
    );

  if (location.pathname === '/schedule/type-of-care') {
    if (featureImmediateCareAlert) return <BackLink />;
    return (
      <Breadcrumbs>
        <a href="/my-health/appointments/schedule/type-of-care">{pageTitle}</a>
      </Breadcrumbs>
    );
  }

  return <BackLink />;
}
Nav.propTypes = {
  pageTitle: PropTypes.string.isRequired,
};

export default function FormLayout({ children, pageTitle }) {
  const location = useLocation();
  const featureImmediateCareAlert = useSelector(
    selectFeatureImmediateCareAlert,
  );

  return (
    <>
      <MhvSecondaryNav />
      <div className="vads-l-grid-container vads-u-padding-x--2p5 desktop-lg:vads-u-padding-x--0 vads-u-padding-bottom--2">
        <Nav pageTitle={pageTitle} />
        {location.pathname.endsWith('type-of-care') && (
          <DowntimeNotification
            appTitle="appointments tool"
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
            {featureImmediateCareAlert &&
              !location.pathname.endsWith('schedule') && (
                <span className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal">
                  <Title />
                </span>
              )}
            {!featureImmediateCareAlert && (
              <span className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal">
                <Title />
              </span>
            )}
            <ErrorBoundary>{children}</ErrorBoundary>
            <NeedHelp />
          </div>
        </div>
      </div>
    </>
  );
}

FormLayout.propTypes = {
  children: PropTypes.object,
  pageTitle: PropTypes.string,
};
