import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Section from '../Section';
import AppointmentDateTime from '../AppointmentDateTime';
import AppointmentFacilityLocation from '../AppointmentFacilityLocation';
import { Details } from './DetailPageLayout';

export default function EpsCancellationLayout({
  cancellationConfirmed,
  onConfirmCancellation,
  onAbortCancellation,
  appointment,
}) {
  return (
    <div>
      <va-card
        className="vaos-appts__appointment-details--container vads-u-margin-top--4 vads-u-border--2px vads-u-border-color--gray-medium vads-u-padding-x--2p5 vads-u-padding-top--5 vads-u-padding-bottom--3"
        data-testid="cancel-appointment-card"
        icon-name="location_city"
      >
        <h3 data-testid="cc-appointment-card-header" data-dd-privacy="mask">
          Community care appointment
        </h3>
        <Section heading="When">
          <AppointmentDateTime
            start={appointment.start}
            timezone={appointment.provider.location.timezone}
          />
        </Section>
        {/* Is it possible to get typeOfCare? Maybe from Referral? */}
        <Section heading="What">
          {appointment.typeOfCare ? (
            <p
              className="vads-u-margin-top--0 vads-u-margin-bottom--0"
              data-dd-privacy="mask"
            >
              {appointment.typeOfCare}
            </p>
          ) : (
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              Type of care not available
            </p>
          )}
        </Section>
        <Section heading="Who">
          {appointment.provider?.name ? (
            <p
              className="vads-u-margin-top--0 vads-u-margin-bottom--0"
              data-dd-privacy="mask"
            >
              {appointment.provider.name}
            </p>
          ) : (
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              Provider name not available
            </p>
          )}
        </Section>
        <Section heading="Where">
          <AppointmentFacilityLocation
            locationName={appointment.provider.location.name}
            locationAddress={appointment.provider.location.address}
            locationPhone={appointment.provider.phone}
          />
        </Section>
        <Details otherDetails={appointment.comments} />
      </va-card>
      {!cancellationConfirmed && (
        <div className="vads-u-display--flex vads-u-margin-top--4 vaos-appts__block-label vads-u-flex-direction--column  vaos-hide-for-print  vaos-form__button-container">
          <VaButton
            text="Yes, cancel appointment"
            onClick={() => {
              onConfirmCancellation();
            }}
            data-testid="cancel-button"
            uswds
          />
          <VaButton
            text="No, do not cancel"
            secondary
            onClick={() => {
              onAbortCancellation();
            }}
            data-testid="do-not-cancel-button"
            uswds
          />
        </div>
      )}
    </div>
  );
}

EpsCancellationLayout.propTypes = {
  appointment: PropTypes.object.isRequired,
  cancellationConfirmed: PropTypes.bool.isRequired,
  onAbortCancellation: PropTypes.func.isRequired,
  onConfirmCancellation: PropTypes.func.isRequired,
};
