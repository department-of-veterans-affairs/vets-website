import React from 'react';
import { connect } from 'react-redux';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import {
  locationSelector,
  organizationSelector,
} from '../../../shared/utils/selectors';
import { selectQuestionnaireContext } from '../../../shared/redux-selectors';

const GetHelpFooter = props => {
  const { currentLocation, context } = props;
  const { organization: facility, location: clinic } = context || {};
  if (currentLocation?.pathname.replace(/\/$/, '').endsWith('confirmation')) {
    return null;
  }

  const HELP_NUMBER = '800-698-2411';
  const TTY_NUMBER = '711';

  const WhoToContact = () => {
    const clinicName = locationSelector.getName(clinic);
    const clinicPhone = locationSelector.getPhoneNumber(clinic, {
      separateExtension: true,
    });
    const facilityName = organizationSelector.getName(facility);
    const facilityPhone = organizationSelector.getPhoneNumber(facility, {
      separateExtension: true,
    });
    const facilityId = organizationSelector.getFacilityIdentifier(facility);
    if (clinic && clinicPhone?.number) {
      return (
        <span data-testid="clinic-details">
          You can contact them at {clinicName} at{' '}
          <Telephone
            contact={clinicPhone.number}
            extension={clinicPhone.extension}
          />
          .
        </span>
      );
    } else if (facility && facilityPhone?.number) {
      return (
        <span data-testid="facility-details">
          You can contact them at {facilityName} at{' '}
          <Telephone
            contact={facilityPhone.number}
            extension={facilityPhone.extension}
          />
          .
        </span>
      );
    } else {
      return (
        <>
          <a
            href={`/find-locations/facility/${facilityId}`}
            data-testid="default-details"
          >
            Contact your VA provider
          </a>
          .
        </>
      );
    }
  };
  return (
    <div className="row questionnaire-help-footer">
      <div className="usa-width-two-thirds medium-8 columns">
        <h2 className="help-heading">Need help?</h2>
        <p>
          <span className={'vads-u-font-weight--bold'}>
            For questions about your appointment or if you have a health-related
            concern,
          </span>{' '}
          call your VA provider. <WhoToContact />
        </p>
        <p>
          <span className={'vads-u-font-weight--bold'}>
            Can't find an appointment that you think should be listed?
          </span>{' '}
          You may not have a questionnaire for that appointment.{' '}
          <a href="/health-care/schedule-view-va-appointments/appointments/">
            Go to the list of all your VA health appointments.
          </a>
        </p>
        <p>
          <span className={'vads-u-font-weight--bold'}>
            For questions about how to fill out your health care questionnaire
            or if you need help with the form,
          </span>{' '}
          please call our MyVA411 main information line at{' '}
          <Telephone contact={HELP_NUMBER} /> and select 0. We're here 24/7.
        </p>
        <p>
          If you have hearing loss, call{' '}
          <Telephone contact={TTY_NUMBER}>TTY: {TTY_NUMBER}</Telephone>
        </p>
      </div>
    </div>
  );
};
const mapStateToProps = state => ({
  context: selectQuestionnaireContext(state),
});
export default connect(mapStateToProps)(GetHelpFooter);
