import React, { useState, useEffect } from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { useHistory } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { FETCH_STATUS, GA_PREFIX } from 'applications/vaos/utils/constants';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import * as actions from '../redux/actions';
import {
  selectCanUseVaccineFlow,
  selectDirectScheduleSettingsStatus,
} from '../redux/selectors';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import NewTabAnchor from '../../components/NewTabAnchor';

/**
 * React component used to conditionally render radio call-to-action buttons and start applicable workflow.
 * @property {boolean} [canUseVaccineFlow] - A boolean value to determine Whether or not to show COVID-19 vaccine option.
 * @property {function} startNewAppointmentFlow - A function that’s called when the user starts the new appointment flow.
 * @property {function} startNewVaccineFlow - A function that’s called when the user starts the vaccine flow.
 * @example
 * <ScheduleNewAppointmentRadioButtons
 *  canUseVaccineFlow={valueFromProp}
 *  startNewAppointmentFlow={givenFlowFromProp}
 *  startNewVaccineFlow={givenFlowFromProp}
 * />
 * @module appointment-list/components
 */
export default function ScheduleNewAppointmentRadioButtons() {
  const history = useHistory();
  const dispatch = useDispatch();
  const canUseVaccineFlow = useSelector(
    state => selectCanUseVaccineFlow(state),
    shallowEqual,
  );
  const directScheduleSettingsStatus = useSelector(
    state => selectDirectScheduleSettingsStatus(state),
    shallowEqual,
  );

  const [radioSelection, setRadioSelection] = useState();
  useEffect(() => {
    if (directScheduleSettingsStatus === FETCH_STATUS.notStarted) {
      dispatch(actions.fetchDirectScheduleSettings());
    }
  }, []);

  if (
    directScheduleSettingsStatus === FETCH_STATUS.loading ||
    directScheduleSettingsStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <div className="vads-u-padding-y--3 vads-u-margin-bottom--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
        <h2 className="vads-u-font-size--h3 vads-u-padding-bottom--0 vads-u-margin-y--0">
          Schedule a new appointment
        </h2>
        <LoadingIndicator message="Checking for available appointment types..." />
      </div>
    );
  }

  const radioOptions = [
    {
      value: 'new-appointment',
      label: 'Primary or specialty care',
    },
  ];

  if (canUseVaccineFlow) {
    radioOptions.push({
      value: 'new-covid-19-vaccine-booking',
      label: 'COVID-19 vaccine',
    });
  }

  const onlyRegularAppointmentFlow = radioOptions.length === 1;
  const selectedOption = onlyRegularAppointmentFlow
    ? radioOptions[0].value
    : radioSelection;

  return (
    <div className="vads-u-padding-y--3 vads-u-margin-bottom--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
      <h2 className="vads-u-padding-bottom--0 vads-u-margin-y--0">
        Schedule a new appointment
      </h2>
      {!canUseVaccineFlow && (
        <AlertBox
          className="vads-u-margin-top--1p5"
          status="info"
          backgroundOnly
        >
          <h3 className="vads-u-font-size--base vads-u-line-height--1 vads-u-margin-top--0 vads-u-margin-bottom--1p5 vads-u-font-family--sans">
            COVID-19 vaccines
          </h3>
          Note: At this time, you can't schedule a COVID-19 vaccine appointment
          online.{' '}
          <NewTabAnchor href="/health-care/covid-19-vaccine">
            Get the latest updates about COVID-19 vaccines at VA
          </NewTabAnchor>
          .
        </AlertBox>
      )}
      {onlyRegularAppointmentFlow && (
        <div className="vads-u-margin-top--1p5">
          Schedule primary or specialty care.
        </div>
      )}
      {!onlyRegularAppointmentFlow && (
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
      )}

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
              dispatch(actions.startNewAppointmentFlow());
              history.push(`/${selectedOption}`);
            } else {
              recordEvent({
                event: `${GA_PREFIX}-schedule-covid19-button-clicked`,
              });
              dispatch(actions.startNewVaccineFlow());
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
