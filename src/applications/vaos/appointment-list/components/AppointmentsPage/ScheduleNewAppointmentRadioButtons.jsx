import React, { useState } from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { Link } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from 'applications/vaos/utils/constants';

/**
 * React component used to conditionally render radio call-to-action buttons and start applicable workflow.
 * @property {boolean} [showCheetahScheduleButton=false] - A boolean value to determine Whether or not to show COVID-19 vaccine option.
 * @property {function} startNewAppointmentFlow - A function that’s called when the user starts the new appointment flow.
 * @component
 * @example
 * <ScheduleNewAppointmentRadioButtons
 *  showCheetahScheduleButton={valueFromProp}
 *  startNewAppointmentFlow={givenFlowFromProp()}
 * />
 * @module appointment-list/components
 */
export default function ScheduleNewAppointmentRadioButtons({
  showCheetahScheduleButton = false,
  startNewAppointmentFlow,
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
        <span className="vads-u-padding--0 va-action-link--disabled">
          Choose an appointment type
        </span>
      )}

      {radioSelection && (
        <Link
          id="new-appointment-radio-link"
          className="vads-u-padding--0 va-action-link--green"
          to={`/${radioSelection}`}
          onClick={() => {
            recordEvent({
              event: `${GA_PREFIX}-${
                radioSelection === 'new-appointment'
                  ? 'schedule-appointment-button-clicked'
                  : 'schedule-project-cheetah-button-clicked'
              }`,
            });
            startNewAppointmentFlow();
          }}
        >
          Start scheduling
        </Link>
      )}
    </>
  );
}
