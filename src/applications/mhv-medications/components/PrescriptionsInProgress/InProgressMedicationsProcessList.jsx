import React from 'react';
import PropTypes from 'prop-types';
import Prescription from './Prescription';
import pluralize from '../../util/helpers/pluralize';
import TooEarlyToRefillCard from './TooEarlyToRefillCard';

const SubmittedStep = ({ submitted = [], tooEarly = [] }) => {
  const descriptionText = submitted.length
    ? `We’ve received your request to refill ${pluralize(
        submitted.length,
        'this medication',
        'these medications',
      )}. It may take up to 7 days to start processing your request.`
    : 'You haven’t requested any medication refills.';

  const noteText = submitted.length
    ? 'Medications prescribed in the last 24 hours may not be here yet.'
    : 'Medication refills you requested in the last 24 hours may not be here yet.';

  return (
    <va-process-list-item header="Request submitted" level={2}>
      <p>{descriptionText}</p>
      <p>
        <strong>Note:</strong>
        {` ${noteText}`}
      </p>
      <div data-testid="submitted-prescriptions">
        {submitted.map(prescription => (
          <Prescription key={prescription.prescriptionId} {...prescription} />
        ))}
      </div>
      {tooEarly.length > 0 && <TooEarlyToRefillCard tooEarly={tooEarly} />}
    </va-process-list-item>
  );
};

SubmittedStep.propTypes = {
  submitted: PropTypes.array.isRequired,
  tooEarly: PropTypes.array.isRequired,
};

const InProgressStep = ({ prescriptions }) => {
  const descriptionText = prescriptions.length
    ? `Our pharmacy team is working to fill ${pluralize(
        prescriptions.length,
        'this medication request',
        'these medication requests',
      )}. We'll tell you when we expect to ship ${pluralize(
        prescriptions.length,
        'it',
        'them',
      )}.`
    : 'No fills are currently in progress.';
  return (
    <va-process-list-item header="Fill in progress" level={2}>
      <p>{descriptionText}</p>
      {prescriptions.map(rx => (
        <Prescription
          key={rx.prescriptionId}
          prescriptionId={rx.prescriptionId}
          prescriptionName={rx.prescriptionName}
          lastUpdated={rx.lastUpdated}
          status={rx.status}
        />
      ))}
    </va-process-list-item>
  );
};

InProgressStep.propTypes = {
  prescriptions: PropTypes.array.isRequired,
};

const ShippedStep = ({ prescriptions }) => {
  const descriptionText = prescriptions.length
    ? `${pluralize(
        prescriptions.length,
        'This medication is on its way to you or has already arrived',
        'These medications are on their way to you or have already arrived',
      )}. It usually takes 3-5 days after shipping for medications to arrive at your address.`
    : 'No medications have recently shipped.';
  return (
    <va-process-list-item header="Medication shipped" level={2}>
      <p>{descriptionText}</p>
      {/* TODO map prescriptions to Prescription components */}
    </va-process-list-item>
  );
};

ShippedStep.propTypes = {
  prescriptions: PropTypes.array.isRequired,
};

const InProgressMedicationsProcessList = ({ prescriptions }) => {
  const parseData = (data = []) => {
    const inProgress = data.filter(item => item.status === 'in-progress');
    const shipped = data.filter(item => item.status === 'shipped');
    const submitted = data.filter(item => item.status === 'submitted');
    const tooEarly = data.filter(item => item.status === 'too-early');

    return { inProgress, shipped, submitted, tooEarly };
  };

  const { inProgress, shipped, submitted, tooEarly } = parseData(prescriptions);

  return (
    <va-process-list>
      <SubmittedStep submitted={submitted} tooEarly={tooEarly} />
      <InProgressStep prescriptions={inProgress} />
      <ShippedStep prescriptions={shipped} />
    </va-process-list>
  );
};

InProgressMedicationsProcessList.propTypes = {
  prescriptions: PropTypes.array.isRequired,
};

export default InProgressMedicationsProcessList;
