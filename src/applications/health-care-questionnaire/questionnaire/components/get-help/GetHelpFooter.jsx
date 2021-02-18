import React from 'react';
import { connect } from 'react-redux';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import {
  getClinicFromAppointment,
  getFacilityFromAppointment,
} from '../../utils';

const GetHelpFooter = props => {
  const { currentLocation, appointment } = props;
  if (currentLocation?.pathname.replace(/\/$/, '').endsWith('confirmation')) {
    return null;
  }

  const HELP_NUMBER = '800-698-2411';
  const TTY_NUMBER = '711';
  const FACILITY_LOCATOR_URL = '/find-locations';

  const WhoToContact = () => {
    const clinic = getClinicFromAppointment(appointment);
    const facility = getFacilityFromAppointment(appointment);
    if (clinic && clinic.phoneNumber) {
      return (
        <span data-testid="clinic-details">
          You can contact them at {clinic.friendlyName} at{' '}
          <Telephone contact={clinic.phoneNumber} />.
        </span>
      );
    } else if (facility && facility.phoneNumber) {
      return (
        <span data-testid="facility-details">
          You can contact them at {facility.displayName} at{' '}
          <Telephone contact={facility.phoneNumber} />.
        </span>
      );
    } else {
      return (
        <>
          <a href={FACILITY_LOCATOR_URL} data-testid="default-details">
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
          For questions about your appointment or if you have a health-related
          concern, call your VA provider. <WhoToContact />
        </p>
        <p>
          For questions about how to fill out your health care questionnaire or
          if you need help with the form, please call our MyVA411 main
          information line at <Telephone contact={HELP_NUMBER} /> and select 0.
          We're here 24/7.
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
  appointment: state?.questionnaireData?.context?.appointment,
});
export default connect(mapStateToProps)(GetHelpFooter);
