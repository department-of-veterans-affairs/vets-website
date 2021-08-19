import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import {
  locationSelector,
  organizationSelector,
} from '../../../shared/utils/selectors';

export default function ConfirmationPageFooter(props) {
  const { context } = props;
  const { location: clinic, organization: facility } = context;

  const PhoneNumbers = () => {
    const clinicName = locationSelector.getName(clinic);
    const clinicPhone = locationSelector.getPhoneNumber(clinic, {
      separateExtension: true,
    });
    const facilityName = organizationSelector.getName(facility);
    const facilityPhone = organizationSelector.getPhoneNumber(facility, {
      separateExtension: true,
    });
    const facilityId = organizationSelector.getFacilityIdentifier(facility);
    if (clinic && clinicPhone?.number && facility && facilityPhone?.number) {
      return (
        <span data-testid="full-details">
          If you have questions about your upcoming appointment, please call
          your VA provider. You can contact them at {clinicName} at{' '}
          <Telephone
            contact={clinicPhone.number}
            extension={clinicPhone.extension}
          />{' '}
          or {facilityName} at{' '}
          <Telephone
            contact={facilityPhone.number}
            extension={facilityPhone.extension}
          />
          .
        </span>
      );
    } else if (clinic && clinicPhone?.number) {
      return (
        <span data-testid="clinic-only-details">
          If you have questions about your upcoming appointment, please call
          your VA provider. You can contact them at {clinicName} at{' '}
          <Telephone
            contact={clinicPhone.number}
            extension={clinicPhone.extension}
          />
          .
        </span>
      );
    } else if (facility && facilityPhone?.number) {
      return (
        <span data-testid="facility-only-details">
          If you have questions about your upcoming appointment, please call
          your VA provider. You can contact them at {facilityName} at{' '}
          <Telephone
            contact={facilityPhone.number}
            extension={facilityPhone.extension}
          />
          .
        </span>
      );
    } else {
      return (
        <span data-testid="default-details">
          If you have questions about your upcoming appointment, please call
          your VA provider.{' '}
          <a href={`/find-locations/facility/${facilityId}`}>
            Contact your VA provider
          </a>
          .
        </span>
      );
    }
  };

  return (
    <div className="next-steps">
      <h2>What if I have questions about my appointment?</h2>
      <p>
        <PhoneNumbers />
      </p>
      <div className="nav-buttons">
        <a
          className="questionnaire-link usa-button-primary usa-button-secondary"
          href="/health-care/health-questionnaires/questionnaires"
        >
          Go to your health questionnaires
        </a>
        <a
          className="appointment-details-link usa-button-primary usa-button-secondary"
          href="/health-care/schedule-view-va-appointments/appointments/"
        >
          Go to your appointment details
        </a>
      </div>
    </div>
  );
}
