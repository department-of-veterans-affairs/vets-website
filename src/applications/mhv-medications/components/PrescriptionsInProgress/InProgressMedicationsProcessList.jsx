import React from 'react';
import PropTypes from 'prop-types';
import Prescription from './Prescription';
import TooEarlyToRefillCard from './TooEarlyToRefillCard';
import pluralize from '../../util/helpers/pluralize';
import { IN_PROGRESS_MEDS_DISPLAY_TYPES } from '../../util/constants';

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
          <Prescription
            key={prescription.prescriptionId}
            displayType={IN_PROGRESS_MEDS_DISPLAY_TYPES.SUBMITTED}
            prescription={prescription}
          />
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
      <div data-testid="in-progress-prescriptions">
        {prescriptions.map(prescription => (
          <Prescription
            key={prescription.prescriptionId}
            displayType={IN_PROGRESS_MEDS_DISPLAY_TYPES.IN_PROGRESS}
            prescription={prescription}
          />
        ))}
      </div>
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
      <div data-testid="shipped-prescriptions">
        {prescriptions.map(prescription => (
          <Prescription
            key={prescription.prescriptionId}
            displayType={IN_PROGRESS_MEDS_DISPLAY_TYPES.SHIPPED}
            prescription={prescription}
          />
        ))}
      </div>
    </va-process-list-item>
  );
};

ShippedStep.propTypes = {
  prescriptions: PropTypes.array.isRequired,
};

const InProgressMedicationsProcessList = ({
  inProgress = [],
  shipped = [],
  submitted = [],
  tooEarly = [],
}) => (
  <va-process-list>
    <SubmittedStep submitted={submitted} tooEarly={tooEarly} />
    <InProgressStep prescriptions={inProgress} />
    <ShippedStep prescriptions={shipped} />
  </va-process-list>
);

InProgressMedicationsProcessList.propTypes = {
  inProgress: PropTypes.arrayOf(
    PropTypes.shape({
      prescriptionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }),
  ),
  shipped: PropTypes.arrayOf(
    PropTypes.shape({
      prescriptionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }),
  ),
  submitted: PropTypes.arrayOf(
    PropTypes.shape({
      prescriptionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }),
  ),
  tooEarly: PropTypes.arrayOf(
    PropTypes.shape({
      prescriptionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }),
  ),
};

export default InProgressMedicationsProcessList;
