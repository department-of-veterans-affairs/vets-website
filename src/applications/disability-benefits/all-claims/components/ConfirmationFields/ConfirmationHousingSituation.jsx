import React from 'react';
import PropTypes from 'prop-types';
import {
  HOMELESS_HOUSING_LABELS,
  AT_RISK_HOUSING_LABELS,
  HOMELESSNESS_TYPES,
} from '../../constants';
import {
  homelessConfirmationLabel,
  atRiskConfirmationLabel,
} from '../../content/homelessOrAtRisk';

const ConfirmationHousingSituation = ({ formData }) => {
  const isHomeless = formData.homelessOrAtRisk === HOMELESSNESS_TYPES.homeless;
  const isAtRisk = formData.homelessOrAtRisk === HOMELESSNESS_TYPES.atRisk;
  const homelessnessContact = formData.homelessnessContact || {};

  return (
    <div data-testid="housing-situation-responses">
      <h4>Housing situation</h4>
      <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
        <li>
          <div className="vads-u-color--gray">
            Are you homeless or at risk of becoming homeless?
          </div>
        </li>
        <li>
          <div>
            {formData.homelessOrAtRisk === HOMELESSNESS_TYPES.homeless &&
              homelessConfirmationLabel}
            {formData.homelessOrAtRisk === HOMELESSNESS_TYPES.atRisk &&
              atRiskConfirmationLabel}
            {formData.homelessOrAtRisk === HOMELESSNESS_TYPES.notHomeless &&
              'No'}
          </div>
        </li>

        {isHomeless && (
          <div>
            <li>
              <div className="vads-u-color--gray">
                Please describe your current living situation:
              </div>
              {HOMELESS_HOUSING_LABELS[
                (formData['view:isHomeless']?.homelessHousingSituation)
              ] || ''}
            </li>
            {formData['view:isHomeless']?.homelessHousingSituation ===
              'other' && (
              <li>
                <div className="vads-u-color--gray">Please describe:</div>
                {formData['view:isHomeless']?.otherHomelessHousing || ''}
              </li>
            )}
            <li>
              <div className="vads-u-color--gray">
                Do you need to quickly leave your current living situation?
              </div>
              {formData['view:isHomeless']?.needToLeaveHousing ? 'Yes' : 'No'}
            </li>
          </div>
        )}

        {isAtRisk && (
          <div>
            <li>
              <div className="vads-u-color--gray">
                Please describe your housing situation:
              </div>
              {AT_RISK_HOUSING_LABELS[
                (formData['view:isAtRisk']?.atRiskHousingSituation)
              ] || ''}
            </li>
            {formData['view:isAtRisk']?.atRiskHousingSituation === 'other' && (
              <li>
                <div className="vads-u-color--gray">Please describe: </div>
                {formData['view:isAtRisk']?.otherAtRiskHousing || ''}
              </li>
            )}
          </div>
        )}
        {homelessnessContact.name && (
          <>
            <li>
              <div className="vads-u-color--gray">
                Please provide the name of a person or place we can call if we
                need to get in touch with you:
              </div>
            </li>
            <li>Name: {homelessnessContact.name}</li>
            <li>Phone number: {homelessnessContact.phoneNumber}</li>
          </>
        )}
      </ul>
    </div>
  );
};

ConfirmationHousingSituation.propTypes = {
  formData: PropTypes.object,
};
export default ConfirmationHousingSituation;
