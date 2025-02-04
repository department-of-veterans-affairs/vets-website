import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
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
      {children}
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
      {children}
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
      {children}
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
      {children}
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

export function CCDetails({ otherDetails, request, level = 2 }) {
  const heading = request
    ? 'Details you’d like to share with your provider'
    : 'Details you shared with your provider';
  return (
    <Section heading={heading} level={level}>
      <span className="vaos-u-word-break--break-word">
        Other details: {`${otherDetails || 'Not available'}`}
      </span>
    </Section>
  );
}
CCDetails.propTypes = {
  level: PropTypes.number,
  otherDetails: PropTypes.string,
  request: PropTypes.bool,
};

export function Details({ reason, otherDetails, request, level = 2 }) {
  const heading = request
    ? 'Details you’d like to share with your provider'
    : 'Details you shared with your provider';
  return (
    <Section heading={heading} level={level}>
      <span>
        Reason: {`${reason && reason !== 'none' ? reason : 'Not available'}`}
      </span>
      <br />
      <span className="vaos-u-word-break--break-word">
        Other details: {`${otherDetails || 'Not available'}`}
      </span>
    </Section>
  );
}
Details.propTypes = {
  level: PropTypes.number,
  otherDetails: PropTypes.string,
  reason: PropTypes.string,
  request: PropTypes.bool,
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

  if (!appointment) return null;

  const isPastAppointment = selectIsPast(appointment);

  return (
    <>
      <BackLink appointment={appointment} />
      <AppointmentCard appointment={appointment}>
        <h1 className="vaos__dynamic-font-size--h2">{heading}</h1>
        {featureTravelPayViewClaimDetails && (
          <ErrorAlert appointment={appointment} />
        )}
        <StatusAlert appointment={appointment} facility={facility} />
        {featureTravelPaySubmitMileageExpense &&
          featureTravelPayViewClaimDetails && (
            <AppointmentTasksSection appointment={appointment} />
          )}
        {isPastAppointment &&
          APPOINTMENT_STATUS.booked === appointment.status && (
            <AfterVisitSummary data={appointment} />
          )}
        {children}
        {featureTravelPayViewClaimDetails && (
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
