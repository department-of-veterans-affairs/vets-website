import React from 'react';
import PropTypes from 'prop-types';
import pluralize from '../../util/helpers/pluralize';

const SubmittedStep = ({ prescriptions }) => {
  const descriptionText = prescriptions.length
    ? `We’ve received your request to refill ${pluralize(
        prescriptions.length,
        'this medication',
        'these medications',
      )}. It may take up to 7 days to start processing your request.`
    : 'You haven’t requested any medication refills.';

  const noteText = prescriptions.length
    ? 'Medications prescribed in the last 24 hours may not be here yet.'
    : 'Medication refills you requested in the last 24 hours may not be here yet.';
  return (
    <va-process-list-item header="Request submitted" level={2}>
      <p>{descriptionText}</p>
      <p>
        <strong>Note:</strong>
        {` ${noteText}`}
      </p>
      {/* TODO map prescriptions to Prescription components */}
    </va-process-list-item>
  );
};

SubmittedStep.propTypes = {
  prescriptions: PropTypes.array.isRequired,
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
      {/* TODO map prescriptions to Prescription components */}
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
  const parseData = data => {
    const inProgress = data.filter(item => item.status === 'in-progress');
    const shipped = data.filter(item => item.status === 'shipped');
    const submitted = data.filter(item => item.status === 'submitted');

    return { inProgress, shipped, submitted };
  };

  const { inProgress, shipped, submitted } = parseData(prescriptions);

  return (
    <va-process-list>
      <SubmittedStep prescriptions={submitted} />
      <InProgressStep prescriptions={inProgress} />
      <ShippedStep prescriptions={shipped} />
    </va-process-list>
  );
};

InProgressMedicationsProcessList.propTypes = {
  prescriptions: PropTypes.array.isRequired,
};

export default InProgressMedicationsProcessList;
