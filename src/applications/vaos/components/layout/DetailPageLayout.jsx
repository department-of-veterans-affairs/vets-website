import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { shallowEqual } from 'recompose';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import BackLink from '../BackLink';
import AppointmentCard from '../AppointmentCard';
import { getConfirmedAppointmentDetailsInfo } from '../../appointment-list/redux/selectors';
import { APPOINTMENT_STATUS, GA_PREFIX } from '../../utils/constants';
import { startAppointmentCancel } from '../../appointment-list/redux/actions';

export function Section({ children, heading }) {
  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
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

export function Where({ children }) {
  return <Section heading="Where to attend">{children}</Section>;
}
Where.propTypes = {
  children: PropTypes.node,
};

function CancelButton({ appointment }) {
  const dispatch = useDispatch();
  const { status, vaos } = appointment;
  const { isCommunityCare } = vaos;

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

  if (!isCommunityCare && APPOINTMENT_STATUS.cancelled !== status)
    return button;

  if (isCommunityCare && APPOINTMENT_STATUS.booked !== status) return button;

  return null;
}

export default function DetailPageLayout({ children, header, instructions }) {
  const { id } = useParams();
  const { appointment } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );

  return (
    <>
      <BackLink appointment={appointment} />
      <AppointmentCard appointment={appointment}>
        <h1>{header}</h1>
        {!!instructions && <p>{instructions}</p>}
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
  header: PropTypes.string,
  instructions: PropTypes.string,
};
