import React from 'react';
import { useSelector } from 'react-redux';
import { parse } from 'date-fns';

// @ts-expect-error - No type definitions available for this module
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '@department-of-veterans-affairs/platform-user/authentication/selectors';

import {
  fieldHasValue,
  formatImmunizationDate,
  getFormattedAppointmentDate,
  parseProblemDateTime,
  parseVistaDateTime,
} from '../utils';
import {
  APPOINTMENT_TYPES,
  MEDICATION_SOURCES,
  MEDICATION_TYPES,
} from '../utils/constants';
import {
  filterMedicationsByType,
  getCombinedMedications,
  getMedicationsTaking,
} from '../utils/medications';
import { normalizePhoneNumber, numberIsClickable } from '../utils/phone';

import type {
  YourHealthInformationProps,
  AvsData,
  Appointment,
  Immunization,
  Problem,
  Allergy,
  LabResultValue,
  Medication,
  AppointmentType,
  RootState,
} from '../types';

import ItemsBlock from './ItemsBlock';
import MedicationTerms from './MedicationTerms';
import ParagraphBlock from './ParagraphBlock';

const getAppointments = (
  type: AppointmentType,
  appointments: Appointment[],
): Appointment[] => {
  return appointments.filter(appointment => appointment.type === type.label);
};

const getAppointmentContent = (
  type: AppointmentType,
  appointments: Appointment[],
): React.ReactNode => {
  const items = getAppointments(type, appointments);
  if (items.length > 0) {
    return items.map((item, idx) => (
      <li key={idx}>
        <h5>{formatDateLong(parseVistaDateTime(item.datetime))}</h5>
        <p className="vads-u-margin-top--0">
          {item.location}
          {item.physicalLocation && ` (${item.physicalLocation})`}
          <br />
          Clinic location: {item.site}
        </p>
      </li>
    ));
  }

  return null;
};

const primaryCareProvider = (avs: AvsData): React.ReactNode => {
  if (avs.primaryCareProviders?.length) {
    return (
      <div>
        <h3>Primary care provider</h3>
        <ul data-testid="primary-care-provider">
          {avs.primaryCareProviders.length && (
            <li>{avs.primaryCareProviders[0]}</li>
          )}
        </ul>
      </div>
    );
  }

  return null;
};

const primaryCareTeam = (avs: AvsData): React.ReactNode => {
  if (
    avs.primaryCareTeamMembers?.length &&
    avs.primaryCareTeamMembers.length > 0
  ) {
    const teamMembers = avs.primaryCareTeamMembers.map((member, idx) => (
      <li key={idx}>
        {member.name}
        {member.title && ` - ${member.title}`}
      </li>
    ));

    return (
      <div>
        <h3 data-testid="primary-care-team">Primary care team</h3>
        <p data-testid="primary-care-team-name">
          {avs.primaryCareTeam && `Team name: ${avs.primaryCareTeam}`}
        </p>
        <ul className="bulleted-list" data-testid="primary-care-team-list">
          {teamMembers}
        </ul>
      </div>
    );
  }

  return null;
};

const appointments = (avs: AvsData): React.ReactNode => {
  if (avs.appointments?.length && avs.appointments.length > 0) {
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
              className="vads-u-padding-left--0 appointment-list"
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
              className="vads-u-padding-left--0 appointment-list"
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

const renderImmunization = (immunization: Immunization): React.ReactNode => {
  return (
    <p>
      {immunization.name}
      <br />
      Date: {formatImmunizationDate(immunization.date)}
      <br />
      Facility: {immunization.facility}
    </p>
  );
};

const renderProblem = (problem: Problem): React.ReactNode => {
  // cf. https://github.com/department-of-veterans-affairs/avs/blob/2af52456e924d8da21b5a8079ac0fb41e6498c63/ll-avs-web/src/main/java/gov/va/med/lom/avs/client/thread/PatientInfoThread.java#L100C87-L100C87
  const problemName = problem.description.replace(/ \(.*\)$/, '');
  return (
    <p>
      {problemName} <br />
      Last updated: {formatDateLong(parseProblemDateTime(problem.lastUpdated))}
    </p>
  );
};

const renderAllergy = (allergy: Allergy): React.ReactNode => {
  return (
    <p>
      {allergy.allergen}
      <br />
      Verified date:{' '}
      {formatDateLong(parse(allergy.verifiedDate, 'MM/dd/yyyy', new Date()))}
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

const labResultValues = (labResult: LabResultValue[]): React.ReactNode => {
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

const labResults = (avs: AvsData): React.ReactNode => {
  if (avs.labResults?.length && avs.labResults.length > 0) {
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
        {avs.labResults && avs.labResults.length > 1 && <hr />}
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

const getMyMedications = (avs: AvsData): Medication[] => {
  return filterMedicationsByType(
    getMedicationsTaking(avs),
    MEDICATION_TYPES.DRUG,
  );
};

const getMySupplies = (avs: AvsData): Medication[] => {
  return filterMedicationsByType(
    getCombinedMedications(avs),
    MEDICATION_TYPES.SUPPLY,
  );
};

const medsIntro = (avs: AvsData, fullState: RootState): React.ReactNode => {
  return (
    <>
      <p>
        The medications listed below were reviewed with you by your provider and
        is provided to you as an updated list of medications. Please remember to
        inform your provider of any medication changes or discrepancies that you
        note. Otherwise, please continue these medications as prescribed.
      </p>
      <p>
        This list includes medications and supplies prescribed by your VA
        providers. It also includes medications and supplies prescribed by
        non-VA providers, if you filled them through a VA pharmacy.
      </p>
      <p>
        If a VA provider entered them in your records, it will also include
        these types of medications and supplies:
      </p>
      <ul>
        <li>Prescriptions you filled through a non-VA pharmacy</li>
        <li>Over-the-counter medications, supplements, and herbal remedies</li>
        <li>Sample medications a provider gave you</li>
        <li>
          Other drugs you’re taking that you don’t have a prescription for,
          including recreational drugs
        </li>
      </ul>
      <p>This list doesn’t include these types of medications and supplies:</p>
      <ul>
        <li>
          Medications you entered yourself. To find your self-entered
          medications, go back to the My HealtheVet website.{' '}
          <a
            href={mhvUrl(
              isAuthenticatedWithSSOe(fullState),
              'self-entered-medications-supplements',
            )}
          >
            Go to your self-entered medications on the My HealtheVet website
          </a>
        </li>
        <li>
          Medications your provider gave you during an inpatient visit (when you
          stay overnight at a hospital or other health facility).
        </li>
        <li>
          Prescriptions from VA providers at facilities that use our My VA
          Health portal. If any of your VA facilities use My VA Health, you can
          find those prescriptions in that portal.{' '}
          <a href="/my-health">Go to My VA Health</a>
        </li>
        <li>
          Certain supplies you order through our Denver Logistics Center,
          instead of through a VA pharmacy. This includes prosthetic socks and
          hearing aid batteries.
        </li>
      </ul>
      <MedicationTerms avs={avs} />
    </>
  );
};

const getDateLastFilled = (medication: Medication): string => {
  if (fieldHasValue(medication.dateLastFilled))
    return medication.dateLastFilled || '';
  if (fieldHasValue(medication.dateLastReleased))
    return medication.dateLastReleased || '';

  return '';
};

const renderFieldWithBreak = (
  field: string | number | undefined,
  prefix = '',
): React.ReactNode => {
  if (fieldHasValue(field)) {
    if (prefix) {
      return (
        <>
          {prefix}: {String(field)} <br />
        </>
      );
    }
    return (
      <>
        {String(field)}
        <br />
      </>
    );
  }

  return '';
};

const renderVaMedication = (medication: Medication): React.ReactNode => {
  const facilityPhone = normalizePhoneNumber(medication.facilityPhone || '');
  const phoneNotClickable = !numberIsClickable(facilityPhone);

  return (
    <>
      <p>
        {renderFieldWithBreak(medication.name)}
        {renderFieldWithBreak(medication.sig)}
        {renderFieldWithBreak(medication.indication, 'Reason for use')}
        {renderFieldWithBreak(medication.description, 'Description')}
        {renderFieldWithBreak(medication.rxNumber, 'Rx #')}
        Notes: {fieldHasValue(medication.comment) && String(medication.comment)}
        <br />
        <br />
        {renderFieldWithBreak(medication.stationName, 'Facility')}
        {!!medication.facilityPhone && (
          <>
            Main phone: [
            <VaTelephone
              contact={facilityPhone}
              notClickable={phoneNotClickable}
            />
            ] (
            <VaTelephone
              contact={(CONTACTS as Record<string, string>)['711']}
              tty
            />
            )<br />
          </>
        )}
        {renderFieldWithBreak(medication.orderingProvider, 'Ordering Provider')}
        <br />
        {renderFieldWithBreak(medication.status, 'Status')}
        Quantity: {String(medication.quantity)} for{' '}
        {String(medication.daysSupply)} days
        <br />
        {renderFieldWithBreak(medication.refillsRemaining, 'Refills remaining')}
        {renderFieldWithBreak(medication.dateExpires, 'Expires')}
        {renderFieldWithBreak(getDateLastFilled(medication), 'Last filled')}
      </p>
    </>
  );
};

const renderNonVaMedication = (medication: Medication): React.ReactNode => {
  return (
    <p>
      {renderFieldWithBreak(medication.name)}
      {renderFieldWithBreak(medication.sig)}
      {renderFieldWithBreak(medication.comment, 'Notes')}
      <br />
      Facility: NON-VA
      <br />
      Documenting Facility & Provider: {medication.documentingFacility},{' '}
      {medication.documentor}
      <br />
      <br />
      {renderFieldWithBreak(medication.status, 'Status')}
    </p>
  );
};

const renderMedication = (medication: Medication): React.ReactNode => {
  switch (medication.medicationSource) {
    case MEDICATION_SOURCES.NON_VA:
      return renderNonVaMedication(medication);
    case MEDICATION_SOURCES.VA:
    default:
      return renderVaMedication(medication);
  }
};

const YourHealthInformation: React.FC<YourHealthInformationProps> = ({
  avs,
}) => {
  const fullState = useSelector((state: RootState) => state);

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

      <ItemsBlock<Problem>
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
      <ItemsBlock<Immunization>
        heading="Immunizations"
        itemType="immunizations"
        items={avs.immunizations}
        renderItem={renderImmunization}
        showSeparators
      />
      <ItemsBlock<Allergy>
        heading="Allergies and adverse drug reactions (signs / symptoms)"
        itemType="allergies-reactions"
        items={avs.allergiesReactions?.allergies}
        renderItem={renderAllergy}
        showSeparators
      />
      {labResults(avs)}
      <ItemsBlock<Medication>
        heading="My medications"
        intro={medsIntro(avs, fullState)}
        itemType="my-medications"
        items={getMyMedications(avs)}
        renderItem={renderMedication}
        showSeparators
      />
      <ItemsBlock<Medication>
        heading="My VA supplies"
        itemType="my-va-supplies"
        items={getMySupplies(avs)}
        renderItem={renderMedication}
        showSeparators
      />
    </div>
  );
};

export default YourHealthInformation;
