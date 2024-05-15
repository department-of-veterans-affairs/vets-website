import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { useParams } from 'react-router-dom';
import BackLink from '../BackLink';
import AppointmentCard from '../AppointmentCard';
import { APPOINTMENT_STATUS, GA_PREFIX } from '../../utils/constants';
import { startAppointmentCancel } from '../../appointment-list/redux/actions';
import AfterVisitSummary from '../AfterVisitSummary';
import {
  selectFacility,
  selectIsPast,
} from '../../appointment-list/redux/selectors';
import StatusAlert from '../StatusAlert';

export function Section({ children, heading }) {
  return (
    <>
      <h2 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
        {heading}
      </h2>
      {children}
    </>
  );
}
Section.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.string,
};

export function When({ children }) {
  return <Section heading="When">{children}</Section>;
}
When.propTypes = {
  children: PropTypes.node,
};

export function What({ children }) {
  return <Section heading="What">{children}</Section>;
}
What.propTypes = {
  children: PropTypes.node,
};

export function Who({ children }) {
  return <Section heading="Who">{children}</Section>;
}
Who.propTypes = {
  children: PropTypes.node,
};

export function Where({ children, isPastAppointment, isCancelled }) {
  if (isPastAppointment || isCancelled)
    return <Section heading="Where">{children}</Section>;
  return <Section heading="Where to attend">{children}</Section>;
}
Where.propTypes = {
  children: PropTypes.node,
  isCancelled: PropTypes.bool,
  isPastAppointment: PropTypes.bool,
};

function CancelButton({ appointment }) {
  const dispatch = useDispatch();
  const { status, vaos } = appointment;
  const { isCommunityCare, isVideo, isPastAppointment } = vaos;

  let event = `${GA_PREFIX}-cancel-booked-clicked`;
  if (APPOINTMENT_STATUS.proposed === status)
    event = `${GA_PREFIX}-cancel-request-clicked`;

  const button = (
    <VaButton
      text="Cancel appointment"
      secondary
      onClick={() => {
        recordEvent({
          event,
        });
        dispatch(startAppointmentCancel(appointment));
      }}
    />
  );

  if (
    APPOINTMENT_STATUS.cancelled !== status &&
    !isCommunityCare &&
    !isVideo &&
    !isPastAppointment
  )
    return button;

  if (APPOINTMENT_STATUS.proposed === status && !isPastAppointment)
    return button;

  return null;
}

export default function DetailPageLayout({
  children,
  data: appointment,
  heading,
}) {
  const { id } = useParams();
  const { facility } = useSelector(state => selectFacility(state, id));

  if (!appointment) return null;

  const isPastAppointment = selectIsPast(appointment);

  return (
    <>
      <BackLink appointment={appointment} />
      <AppointmentCard appointment={appointment}>
        <h1 className="vads-u-font-size--h2">{heading}</h1>
        <StatusAlert appointment={appointment} facility={facility} />
        {isPastAppointment && (
          <Section heading="After visit summary">
            <AfterVisitSummary data={appointment} />
          </Section>
        )}
        {children}
        <div className="vads-u-margin-top--4 vaos-appts__block-label vaos-hide-for-print">
          <span className="vads-u-margin-right--2">
            <VaButton
              text="Print"
              secondary
              onClick={() => window.print()}
              data-testid="print-button"
              uswds
            />
          </span>
          <CancelButton appointment={appointment} />
        </div>
      </AppointmentCard>
    </>
  );
}
DetailPageLayout.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  heading: PropTypes.string,
};
