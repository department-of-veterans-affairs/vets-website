import React from 'react';
import PropTypes from 'prop-types';

import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';

import {
  getFormattedAppointmentDate,
  parseVistaDate,
  parseVistaDateTime,
} from '../utils';
import { APPOINTMENT_TYPES } from '../utils/constants';

import ParagraphBlock from './ParagraphBlock';
import ItemsBlock from './ItemsBlock';

const getAppointments = (type, appointments) => {
  return appointments.filter(appointment => appointment.type === type.label);
};

const getAppointmentContent = (type, appointments) => {
  const items = getAppointments(type, appointments);
  if (items.length > 0) {
    return items.map((item, idx) => (
      <div key={idx}>
        <h5>{formatDateLong(parseVistaDateTime(item.datetime))}</h5>
        <p className="vads-u-margin-top--0">
          {item.location}
          {item.physicalLocation && ` (${item.physicalLocation})`}
          <br />
          Clinic location: {item.site}
        </p>
      </div>
    ));
  }

  return null;
};

const primaryCareProvider = avs => {
  if (avs.primaryCareProviders?.length) {
    return (
      <div>
        <h3>Primary care provider</h3>
        <ul data-testid="primary-care-provider">
          {/* TODO: Confirm that this is correct. */}
          {avs.primaryCareProviders.length && (
            <li>{avs.primaryCareProviders[0]}</li>
          )}
          {avs.primaryCareTeam && <li>{avs.primaryCareTeam}</li>}
        </ul>
      </div>
    );
  }

  return null;
};

const primaryCareTeam = avs => {
  if (avs.primaryCareTeamMembers?.length > 0) {
    const teamMembers = avs.primaryCareTeamMembers.map((member, idx) => (
      <li key={idx}>
        {member.name} - {member.title}
      </li>
    ));

    return (
      <div>
        <h3>Primary care team</h3>
        <ul className="bulleted-list" data-testid="primary-care-team">
          {teamMembers}
        </ul>
      </div>
    );
  }

  return null;
};

const appointments = avs => {
  if (avs.appointments?.length > 0) {
    const scheduledAppointments = getAppointmentContent(
      APPOINTMENT_TYPES.SCHEDULED,
      avs.appointments,
    );
    const recallAppointments = getAppointmentContent(
      APPOINTMENT_TYPES.RECALL,
      avs.appointments,
    );
    return (
      <div>
        <h3>Upcoming appointments</h3>
        {scheduledAppointments && (
          <div>
            <h4>Scheduled appointments</h4>
            <p>Appointments in the next 13 months:</p>
            <ul
              className="vads-u-padding-left--0"
              data-testid="scheduled-appointments"
            >
              {scheduledAppointments}
            </ul>
          </div>
        )}
        {recallAppointments && (
          <div>
            <h4>Recall appointments</h4>
            <p>
              Please know that Recall appointments are not confirmed
              appointments. You will receive a reminder approximately 3 weeks
              before the Recall date to call and request the appointment. When
              you call, you will be assigned a confirmed appointment date and
              time.
            </p>
            <ul
              className="vads-u-padding-left--0"
              data-testid="recall-appointments"
            >
              {recallAppointments}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const renderImmunization = immunization => {
  return (
    <p>
      {immunization.name}
      <br />
      Date: {formatDateLong(parseVistaDate(immunization.date))}
      <br />
      Facility: {immunization.facility}
    </p>
  );
};

const renderProblem = problem => {
  // cf. https://github.com/department-of-veterans-affairs/avs/blob/2af52456e924d8da21b5a8079ac0fb41e6498c63/ll-avs-web/src/main/java/gov/va/med/lom/avs/client/thread/PatientInfoThread.java#L100C87-L100C87
  const problemName = problem.description.replace(/ \(.*\)$/, '');
  return (
    <p>
      {problemName} <br />
      Last updated: {formatDateLong(problem.lastUpdated)}
    </p>
  );
};

const renderAllergy = allergy => {
  return (
    <p>
      {allergy.allergen}
      <br />
      Verified date: {formatDateLong(parseVistaDate(allergy.verifiedDate))}
      <br />
      Severity: {allergy.severity || 'None noted'}
      <br />
      Reaction: {allergy.reactions.join(', ') || 'None noted'}
      <br />
      Allergy type: {allergy.type || 'None noted'}
      <br />
      Site: {allergy.site}
    </p>
  );
};

const labResultValues = labResult => {
  return labResult.map((item, idx) => (
    <div className="lab-result-value vads-u-margin-bottom--2" key={idx}>
      <strong>{item.test}</strong>
      <br />
      Result: {item.result}
      <br />
      Units: {item.units}
      <br />
      Reference range: {item.refRange}
      <br />
      Flag: {item.flag}
    </div>
  ));
};

const labResults = avs => {
  if (avs.labResults?.length > 0) {
    const labResultItems = avs.labResults.map((item, idx) => (
      <div key={idx}>
        {labResultValues(item.values)}
        <p>
          Specimen: {item.specimen}
          <br />
          Ordering provider: {item.orderingProvider}
          <br />
          Collection Date and time: {item.collectionDatetime}
          <br />
          Performing lab: {item.performingLab}
          <br />
        </p>
        {avs.labResults.length > 1 && <hr />}
      </div>
    ));

    return (
      <div className="lab-results" data-testid="lab-results">
        <h3>Recent lab results</h3>
        <p>
          Note: If your results are outside the reference range, this doesn’t
          automatically mean that you have a health problem. Your provider will
          explain what the results mean for your health.
        </p>
        {labResultItems}
      </div>
    );
  }

  return null;
};

const YourHealthInformation = props => {
  const { avs } = props;
  const appointmentDate = getFormattedAppointmentDate(avs);

  return (
    <div>
      <p className="vads-u-margin-top--0">
        Note: the health information in this summary is from {appointmentDate}.{' '}
        <a href="/my-health/">
          Go to the MyHealtheVet website for your current VA medical records.
        </a>
      </p>
      {primaryCareProvider(avs)}
      {primaryCareTeam(avs)}
      {appointments(avs)}

      <ItemsBlock
        heading="Problem list"
        itemType="problems"
        items={avs.problems}
        renderItem={renderProblem}
        showSeparators={false}
      />

      <ParagraphBlock
        heading="Smoking status"
        content={avs.patientInfo?.smokingStatus}
      />
      <ItemsBlock
        heading="Immunizations"
        itemType="immunizations"
        items={avs.immunizations}
        renderItem={renderImmunization}
        showSeparators
      />
      <ItemsBlock
        heading="Allergies and adverse drug reactions (signs / symptoms)"
        itemType="allergies-reactions"
        items={avs.allergiesReactions?.allergies}
        renderItem={renderAllergy}
        showSeparators
      />
      {labResults(avs)}
    </div>
  );
};

export default YourHealthInformation;

YourHealthInformation.propTypes = {
  avs: PropTypes.object,
};
