import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { waitForRenderThenFocus, waitTime } from 'platform/utilities/ui';
import BackLink from '../BackLink';
import AppointmentCard from '../AppointmentCard';
import { APPOINTMENT_STATUS, GA_PREFIX } from '../../utils/constants';
import { startAppointmentCancel } from '../../appointment-list/redux/actions';
import AfterVisitSummary from '../AfterVisitSummary';
import { selectIsPast } from '../../appointment-list/redux/selectors';
import {
  selectFeatureTravelPayViewClaimDetails,
  selectFeatureTravelPaySubmitMileageExpense,
} from '../../redux/selectors';
import StatusAlert from '../StatusAlert';
import FacilityPhone from '../FacilityPhone';
import TravelReimbursementSection from '../TravelReimbursementSection';
import AppointmentTasksSection from '../AppointmentTasksSection';
import Section from '../Section';
import ErrorAlert from '../ErrorAlert';

export function When({ children, level = 2 }) {
  return (
    <Section heading="When" level={level}>
      <span data-dd-privacy="mask">{children}</span>
    </Section>
  );
}
When.propTypes = {
  children: PropTypes.node,
  level: PropTypes.number,
};

export function What({ children, level = 2 }) {
  if (!children) {
    return null;
  }
  return (
    <Section heading="What" level={level}>
      <span data-dd-privacy="mask">{children}</span>
    </Section>
  );
}
What.propTypes = {
  children: PropTypes.node,
  level: PropTypes.number,
};

export function Who({ children, level = 2 }) {
  if (!children) {
    return null;
  }
  return (
    <Section heading="Who" level={level}>
      <span data-dd-privacy="mask">{children}</span>
    </Section>
  );
}
Who.propTypes = {
  children: PropTypes.node,
  level: PropTypes.number,
};

export function Where({ children, heading = 'Where', level = 2 } = {}) {
  return (
    <Section heading={heading} level={level}>
      <span data-dd-privacy="mask">{children}</span>
    </Section>
  );
}
Where.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.string,
  level: PropTypes.number,
};

export function Prepare({ children } = {}) {
  return <Section heading="Prepare for your appointment">{children}</Section>;
}
Prepare.propTypes = {
  children: PropTypes.node,
};

export function CCDetails({ otherDetails, level = 2 }) {
  const heading = 'Reason for appointment';
  return (
    <Section heading={heading} level={level}>
      <span className="vaos-u-word-break--break-word" data-dd-privacy="mask">
        {`${otherDetails || 'Not available'}`}
      </span>
    </Section>
  );
}
CCDetails.propTypes = {
  level: PropTypes.number,
  otherDetails: PropTypes.string,
};

export function Details({ otherDetails, level = 2, isCerner = false }) {
  // Do not display details for Oracle (Cerner) appointments
  if (isCerner) return null;

  const heading = 'Reason for appointment';
  return (
    <Section heading={heading} level={level}>
      <span className="vaos-u-word-break--break-word" data-dd-privacy="mask">
        {`${otherDetails || 'Not available'}`}
      </span>
    </Section>
  );
}
Details.propTypes = {
  isCerner: PropTypes.bool,
  level: PropTypes.number,
  otherDetails: PropTypes.string,
};

export function ClinicOrFacilityPhone({
  clinicPhone,
  clinicPhoneExtension,
  facilityPhone,
}) {
  if (clinicPhone) {
    return (
      <FacilityPhone
        heading="Clinic phone: "
        contact={clinicPhone}
        extension={clinicPhoneExtension}
      />
    );
  }
  if (facilityPhone) {
    return <FacilityPhone contact={facilityPhone} />;
  }
  // if no clinic or facility phone number, it will default to VA main phone number
  return <FacilityPhone />;
}
ClinicOrFacilityPhone.propTypes = {
  clinicPhone: PropTypes.string,
  clinicPhoneExtension: PropTypes.string,
  facilityPhone: PropTypes.string,
};

function CancelButton({ appointment }) {
  const dispatch = useDispatch();
  const { status, vaos } = appointment;
  const { isCancellable, isPastAppointment } = vaos;

  let event = `${GA_PREFIX}-cancel-booked-clicked`;
  if (APPOINTMENT_STATUS.proposed === status)
    event = `${GA_PREFIX}-cancel-request-clicked`;

  const button = (
    <VaButton
      text={`Cancel ${
        APPOINTMENT_STATUS.booked === status ? 'appointment' : 'request'
      }`}
      secondary
      onClick={() => {
        recordEvent({
          event,
        });
        dispatch(startAppointmentCancel(appointment));
      }}
      data-testid="cancel-button"
    />
  );

  if (!!isCancellable && !isPastAppointment) return button;

  if (APPOINTMENT_STATUS.proposed === status) return button;

  return null;
}

export default function DetailPageLayout({
  children,
  data: appointment,
  heading,
  facility,
}) {
  const featureTravelPayViewClaimDetails = useSelector(state =>
    selectFeatureTravelPayViewClaimDetails(state),
  );
  const featureTravelPaySubmitMileageExpense = useSelector(state =>
    selectFeatureTravelPaySubmitMileageExpense(state),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    // Focus on the heading after render -- added function to utilities/ui/focus.js to shorten this interval
    // but still allows cypress tests to run properly
    const wait = waitTime(100);
    waitForRenderThenFocus(
      '#vaos-appointment-details-page-heading',
      document,
      wait,
    );
  }, []);

  if (!appointment) return null;

  const isPastAppointment = selectIsPast(appointment);
  const isNotCanceledAppointment =
    APPOINTMENT_STATUS.cancelled !== appointment.status;

  return (
    <>
      <BackLink appointment={appointment} />
      <AppointmentCard appointment={appointment}>
        <h1
          id="vaos-appointment-details-page-heading"
          className="vaos__dynamic-font-size--h2"
          tabIndex="-1"
        >
          <span data-dd-privacy="mask">{heading}</span>
        </h1>
        {featureTravelPayViewClaimDetails && (
          <ErrorAlert appointment={appointment} />
        )}
        <StatusAlert appointment={appointment} facility={facility} />
        {featureTravelPaySubmitMileageExpense &&
          featureTravelPayViewClaimDetails &&
          isNotCanceledAppointment && (
            <AppointmentTasksSection appointment={appointment} />
          )}
        {isPastAppointment &&
          (APPOINTMENT_STATUS.booked === appointment.status ||
            APPOINTMENT_STATUS.fulfilled === appointment.status) && (
            <AfterVisitSummary data={appointment} />
          )}
        {children}
        {featureTravelPayViewClaimDetails &&
          isNotCanceledAppointment && (
            <TravelReimbursementSection appointment={appointment} />
          )}
        <div
          className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-margin-top--4 vaos-appts__block-label vaos-hide-for-print"
          style={{ rowGap: '16px' }}
        >
          <div className="vads-u-display--auto vads-u-margin-right--2">
            <VaButton
              text="Print"
              secondary
              onClick={() => window.print()}
              data-testid="print-button"
              uswds
            />
          </div>
          <div className="vads-u-flex--auto">
            <CancelButton appointment={appointment} />
          </div>
        </div>
      </AppointmentCard>
    </>
  );
}
DetailPageLayout.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  facility: PropTypes.object,
  heading: PropTypes.string,
};
