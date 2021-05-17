import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { useHistory } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from 'applications/vaos/utils/constants';
import { startNewAppointmentFlow, startNewVaccineFlow } from '../redux/actions';

/**
 * React component used to conditionally render radio call-to-action buttons and start applicable workflow.
 *
 * @module appointment-list/components
 */
export default function ScheduleNewAppointmentRadioButtons() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [radioSelection, setRadioSelection] = useState();

  const radioOptions = [
    {
      value: 'new-appointment',
      label: 'Primary or specialty care',
    },
    {
      value: 'new-covid-19-vaccine-booking',
      label: 'COVID-19 vaccine',
    },
  ];

  const onlyRegularAppointmentFlow = radioOptions.length === 1;
  const selectedOption = onlyRegularAppointmentFlow
    ? radioOptions[0].value
    : radioSelection;

  return (
    <div className="vads-u-padding-y--3 vads-u-margin-bottom--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
      <h2 className="vads-u-padding-bottom--0 vads-u-margin-y--0">
        Schedule a new appointment
      </h2>
      <div className="vads-u-margin-top--1p5">
        <RadioButtons
          label={'Choose an appointment type.'}
          name={'schedule-new-appointment'}
          id={'schedule-new-appointment'}
          options={radioOptions}
          additionalFieldsetClass="vads-u-margin-top--0"
          onValueChange={({ value }) => {
            setRadioSelection(value);
          }}
          value={{ value: radioSelection }}
          errorMessage=""
        />
      </div>

      {!selectedOption && (
        <button
          aria-label="Choose an appointment type to start scheduling"
          id="schedule-button"
          type="button"
          disabled
        >
          Start scheduling{' '}
          <i className="fas fa-angle-double-right" aria-hidden="true" />
        </button>
      )}

      {selectedOption && (
        <button
          aria-label="Start scheduling an appointment"
          id="schedule-button"
          type="button"
          onClick={() => {
            if (selectedOption === 'new-appointment') {
              recordEvent({
                event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
              });
              dispatch(startNewAppointmentFlow());
              history.push(`/${selectedOption}`);
            } else {
              recordEvent({
                event: `${GA_PREFIX}-schedule-covid19-button-clicked`,
              });
              dispatch(startNewVaccineFlow());
              history.push(`/${selectedOption}`);
            }
          }}
        >
          Start scheduling{' '}
          <i className="fas fa-angle-double-right" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
