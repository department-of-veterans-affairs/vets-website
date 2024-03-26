import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { useSelector } from 'react-redux';
import Breadcrumbs from '../../components/Breadcrumbs';
import NeedHelp from '../../components/NeedHelp';
import ErrorBoundary from '../../components/ErrorBoundary';
import WarningNotification from '../../components/WarningNotification';
import { getFormData, getNewAppointment } from '../redux/selectors';
import { FACILITY_TYPES, FLOW_TYPES } from '../../utils/constants';

function getFormTitle({ flowType, facilityType, location }) {
  if (
    !flowType ||
    FLOW_TYPES.DIRECT === flowType ||
    location.pathname.endsWith('type-of-care')
  ) {
    return 'New appointment';
  }

  if (FLOW_TYPES.REQUEST === flowType) {
    if (FACILITY_TYPES.COMMUNITY_CARE === facilityType)
      return 'Request community care';

    return 'Request an appointment';
  }
  return 'New appointment';
}

export default function FormLayout({ children, pageTitle }) {
  const location = useLocation();
  const { flowType } = useSelector(getNewAppointment);
  const { facilityType } = useSelector(getFormData);

  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
      <Breadcrumbs>
        <a href="/my-health/appointments/schedule/type-of-care">{pageTitle}</a>
      </Breadcrumbs>
      {location.pathname.endsWith('new-appointment') && (
        <DowntimeNotification
          appTitle="VA online scheduling tool"
          dependencies={[externalServices.vaosWarning]}
          render={(props, childContent) => (
            <WarningNotification {...props}>{childContent}</WarningNotification>
          )}
        />
      )}
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <span className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
            {getFormTitle({ flowType, facilityType, location })}
          </span>
          <ErrorBoundary>{children}</ErrorBoundary>
          <NeedHelp />
        </div>
      </div>
    </div>
  );
}

FormLayout.propTypes = {
  children: PropTypes.object,
  pageTitle: PropTypes.string,
};
