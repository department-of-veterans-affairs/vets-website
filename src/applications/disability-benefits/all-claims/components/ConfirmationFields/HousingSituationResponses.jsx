import React from 'react';
import PropTypes from 'prop-types';

const HousingSituationResponses = ({ formData }) => {
  const isHomeless = formData.homelessOrAtRisk === 'homeless';
  const isAtRisk = formData.homelessOrAtRisk === 'atRisk';
  const homelessLabel = 'I’m currently homeless.';
  const atRiskLabel = 'I’m at risk of becoming homeless.';
  const homelessnessContact = formData.homelessnessContact || {};
  const homelessHousingSituationDescription = {
    shelter: 'I’m living in a homeless shelter.',
    notShelter:
      'I’m living somewhere other than a shelter. (For example, I’m living in a car or a tent.)',
    anotherPerson: 'I’m living with another person.',
    other: 'Other',
  };
  const atRiskHousingSituation = {
    losingHousing: 'I’m losing my housing in 30 days.',
    leavingShelter: 'I’m leaving a publicly funded homeless shelter soon.',
    other: 'Other',
  };

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
            {formData.homelessOrAtRisk === 'homeless' && homelessLabel}
            {formData.homelessOrAtRisk === 'atRisk' && atRiskLabel}
            {formData.homelessOrAtRisk === 'no' && 'No'}
          </div>
        </li>

        {isHomeless && (
          <div>
            <li>
              <div className="vads-u-color--gray">
                Please describe your current living situation:
              </div>
              {homelessHousingSituationDescription[
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
              {atRiskHousingSituation[
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

HousingSituationResponses.propTypes = {
  formData: PropTypes.object,
};
export default HousingSituationResponses;
