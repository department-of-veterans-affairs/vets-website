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
import getNewAppointmentFlow from '../newAppointmentFlow';

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
Nav.propTypes = {
  pageTitle: PropTypes.string.isRequired,
};

export default function FormLayout({ children, isReviewPage, pageTitle }) {
  const location = useLocation();
  const flow = useSelector(state => getNewAppointmentFlow(state));
  const typeOfCareUrl = flow.typeOfCare?.url;

  return (
    <>
      {location.pathname === typeOfCareUrl && <MhvSecondaryNav />}
      <div className="vads-l-grid-container vads-u-padding-x--2p5 desktop-lg:vads-u-padding-x--0 vads-u-padding-bottom--2">
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
  isReviewPage: PropTypes.bool,
  pageTitle: PropTypes.string,
};
