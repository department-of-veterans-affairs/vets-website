import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { Link } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { FETCH_STATUS, GA_PREFIX } from 'applications/vaos/utils/constants';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import * as actions from '../../redux/actions';
import {
  selectCanUseVaccineFlow,
  selectDirectScheduleSettingsStatus,
} from '../../redux/selectors';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import NewTabAnchor from '../../../components/NewTabAnchor';

/**
 * React component used to conditionally render radio call-to-action buttons and start applicable workflow.
 * @property {boolean} [showCheetahScheduleButton=false] - A boolean value to determine Whether or not to show COVID-19 vaccine option.
 * @property {function} startNewAppointmentFlow - A function that’s called when the user starts the new appointment flow.
 * @property {function} startNewVaccineFlow - A function that’s called when the user starts the vaccine flow.
 * @example
 * <ScheduleNewAppointmentRadioButtons
 *  showCheetahScheduleButton={valueFromProp}
 *  startNewAppointmentFlow={givenFlowFromProp}
 *  startNewVaccineFlow={givenFlowFromProp}
 * />
 * @module appointment-list/components
 */
function ScheduleNewAppointmentRadioButtons({
  canUseVaccineFlow,
  directScheduleSettingsStatus,
  fetchDirectScheduleSettings,
  startNewAppointmentFlow,
  startNewVaccineFlow,
}) {
  const [radioSelection, setRadioSelection] = useState();
  useEffect(() => {
    if (directScheduleSettingsStatus === FETCH_STATUS.notStarted) {
      fetchDirectScheduleSettings();
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
      <h2 className="vads-u-font-size--h3 vads-u-padding-bottom--0 vads-u-margin-y--0">
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
        <RadioButtons
          label={
            <span className="sr-only">
              Choose an appointment type to begin scheduling
            </span>
          }
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
      )}

      {!selectedOption && (
        <span
          aria-disabled="true"
          className="vads-u-padding--0 va-action-link--disabled"
        >
          Choose an appointment type
        </span>
      )}

      {selectedOption && (
        <Link
          id="new-appointment-radio-link"
          className="vads-u-padding--0 va-action-link--green"
          to={`/${selectedOption}`}
          onClick={() => {
            if (selectedOption === 'new-appointment') {
              recordEvent({
                event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
              });
              startNewAppointmentFlow();
            } else {
              recordEvent({
                event: `${GA_PREFIX}-schedule-covid19-button-clicked`,
              });
              startNewVaccineFlow();
            }
          }}
        >
          Start scheduling
        </Link>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    canUseVaccineFlow: selectCanUseVaccineFlow(state),
    directScheduleSettingsStatus: selectDirectScheduleSettingsStatus(state),
  };
}

const mapDispatchToProps = {
  fetchDirectScheduleSettings: actions.fetchDirectScheduleSettings,
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
  startNewVaccineFlow: actions.startNewVaccineFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScheduleNewAppointmentRadioButtons);
