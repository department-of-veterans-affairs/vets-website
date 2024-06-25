import React from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { useDispatch, useSelector } from 'react-redux';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import Breadcrumbs from '../../components/Breadcrumbs';
import NeedHelp from '../../components/NeedHelp';
import ErrorBoundary from '../../components/ErrorBoundary';
import WarningNotification from '../../components/WarningNotification';
import { getFlowType, getFormData } from '../redux/selectors';
import { FACILITY_TYPES, FLOW_TYPES } from '../../utils/constants';
import { routeToPreviousAppointmentPage } from '../redux/actions';
import getNewAppointmentFlow from '../newAppointmentFlow';
import { selectFeatureMhvSecondaryNavigationEnabled } from '../../redux/selectors';

function Title() {
  const flowType = useSelector(getFlowType);
  const formData = useSelector(getFormData);

  if (FLOW_TYPES.REQUEST === flowType) {
    if (FACILITY_TYPES.COMMUNITY_CARE === formData.facilityType) {
      return 'Request community care';
    }

    return 'Request an appointment';
  }

  return 'New appointment';
}

function Nav({ pageTitle }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const pageKey = useSelector(state => state?.newAppointment?.currentPageKey);

  if (location.pathname === '/schedule/type-of-care')
    return (
      <Breadcrumbs>
        <a href="/my-health/appointments/schedule/type-of-care">{pageTitle}</a>
      </Breadcrumbs>
    );

  return (
    <div className="vaos-hide-for-print xsmall-screen:vads-u-margin-bottom--0 small-screen:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2">
      <nav aria-label="backlink" className="vads-u-padding-y--2 ">
        <va-icon
          icon="navigate_before"
          size="2"
          class="vads-u-padding-y--0p25 vads-color-gray-medium"
        />
        <NavLink
          aria-label="Back link"
          to="#"
          className=""
          onClick={e => {
            e.preventDefault();
            dispatch(routeToPreviousAppointmentPage(history, pageKey));
          }}
        >
          Back
        </NavLink>
      </nav>
    </div>
  );
}
Nav.propTypes = {
  pageTitle: PropTypes.string.isRequired,
};

export default function FormLayout({ children, isReviewPage, pageTitle }) {
  const location = useLocation();
  const featureMhvSecondaryNavigationEnabled = useSelector(
    selectFeatureMhvSecondaryNavigationEnabled,
  );
  const flow = useSelector(state => getNewAppointmentFlow(state));
  const typeOfCareUrl = flow.typeOfCare?.url;

  return (
    <>
      {featureMhvSecondaryNavigationEnabled &&
        location.pathname === typeOfCareUrl && <MhvSecondaryNav />}
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
        <Nav pageTitle={pageTitle} />
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
            {!isReviewPage && (
              <span className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
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
  isReviewPage: PropTypes.bool,
  pageTitle: PropTypes.string,
};
