import React, { useState } from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { Link } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from 'applications/vaos/utils/constants';
import PropTypes from 'prop-types';

/**
 * React component used to conditionally render radio call-to-action buttons and start applicable workflow.
 *
 * @component
 * <ScheduleNewAppointmentRadioButtons
 *  showCheetahScheduleButton=true
 *  startNewAppointmentFlow={givenFlowFromProp}
 *  startNewVaccineFlow={givenFlowFromProp}
 * />
 *
 * @category Appointment List
 * @subcategory Appointments Page
 * @module ScheduleNewAppointmentRadioButtons
 */
export default function ScheduleNewAppointmentRadioButtons({
  showCheetahScheduleButton = false,
  startNewAppointmentFlow,
  startNewVaccineFlow,
}) {
  const [radioSelection, setRadioSelection] = useState();

  function radioOptions() {
    const optionsArray = [
      {
        value: 'new-appointment',
        label: 'Primary or specialty care',
      },
    ];

    if (showCheetahScheduleButton) {
      optionsArray.push({
        value: 'new-covid-19-vaccine-booking',
        label: 'COVID-19 vaccine',
      });
    }
    return optionsArray;
  }

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-padding-bottom--0">
        Schedule a new appointment
      </h2>
      <RadioButtons
        label={
          <span className="sr-only">
            Choose an appointment type to begin scheduling
          </span>
        }
        name={'schedule-new-appointment'}
        id={'schedule-new-appointment'}
        options={radioOptions()}
        additionalFieldsetClass="vads-u-margin-top--0"
        onValueChange={({ value }) => {
          setRadioSelection(value);
        }}
        value={{ value: radioSelection }}
        errorMessage=""
      />

      {!radioSelection && (
        <span
          aria-disabled="true"
          className="vads-u-padding--0 va-action-link--disabled"
        >
          Choose an appointment type
        </span>
      )}

      {radioSelection && (
        <Link
          id="new-appointment-radio-link"
          className="vads-u-padding--0 va-action-link--green"
          to={`/${radioSelection}`}
          onClick={() => {
            if (radioSelection === 'new-appointment') {
              recordEvent({
                event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
              });
              startNewAppointmentFlow();
            } else {
              recordEvent({
                event: `${GA_PREFIX}-schedule-project-cheetah-button-clicked`,
              });
              startNewVaccineFlow();
            }
          }}
        >
          Start scheduling
        </Link>
      )}
    </>
  );
}

ScheduleNewAppointmentRadioButtons.propTypes = {
  /**
   * A boolean value to determine Whether or not to show COVID-19 vaccine option
   */
  showCheetahScheduleButton: PropTypes.bool,
  /**
   * A function that’s called when the user starts the new appointment flow
   */
  startNewAppointmentFlow: PropTypes.func,
  /**
   * A function that’s called when the user starts the vaccine flow
   */
  startNewVaccineFlow: PropTypes.func,
};
