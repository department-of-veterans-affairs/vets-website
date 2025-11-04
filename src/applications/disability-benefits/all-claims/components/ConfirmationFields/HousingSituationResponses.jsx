import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeEachWord } from '../../utils';

const HousingSituationResponses = ({ formData }) => {
  // homelessOrAtRisk - "homeless" as a string
  // homelessnessContact {name: "string, phoneNumber: "string"}
  // view:isHomeless {homelessHousingSituation: "string", otherHomelessHousing: "string", needToLeaveHousing: boolean}
  // view:isAtRisk {atRiskHousingSituation: "string", otherAtRiskHousing: "string"}
  // Determine if the user is homeless or at risk
  const isHomeless = formData.homelessOrAtRisk === 'homeless';
  const isAtRisk = formData.homelessOrAtRisk === 'atRisk';
  const homelessnessContact = formData.homelessnessContact || {};

  return (
    <div data-testid="housing-situation-responses">
      <h3>Housing situation</h3>
      {isHomeless && (
        <div>
          <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
            <li>
              <div className="vads-u-color--gray">
                Are you homeless or at risk of becoming homeless?:
              </div>
              {capitalizeEachWord(
                formData['view:isHomeless']?.homelessHousingSituation || '',
              )}
            </li>
            {formData['view:isHomeless']?.homelessHousingSituation ===
              'other' && (
              <li>
                <div className="vads-u-color--gray">
                  Please describe your housing situation:
                </div>
                {formData['view:isHomeless']?.otherHomelessHousing || ''}
              </li>
            )}
            <li>
              <div className="vads-u-color--gray">
                Do you need to quickly leave your current living situation?:
              </div>
              {formData['view:isHomeless']?.needToLeaveHousing ? 'Yes' : 'No'}
            </li>
            {homelessnessContact.name && (
              <>
                <li>
                  <div className="vads-u-color--gray">
                    Please provide the name of a person or place we can call if
                    we need to get in touch with you:
                  </div>
                </li>
                <li>Name: {homelessnessContact.name}</li>
                <li>Phone number: {homelessnessContact.phoneNumber}</li>
              </>
            )}
          </ul>
        </div>
      )}
      {isAtRisk && (
        <div>
          <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
            <li>
              <div className="vads-u-color--gray">
                Are you homeless or at risk of becoming homeless?:
              </div>
              {capitalizeEachWord(
                formData['view:isAtRisk']?.homelessHousingSituation || '',
              )}
            </li>
            {formData['view:isAtRisk']?.atRiskHousingSituation === 'other' && (
              <li>
                <div className="vads-u-color--gray">
                  Other housing situation:{' '}
                </div>
                {formData['view:isAtRisk']?.otherAtRiskHousing || ''}
              </li>
            )}
            <li>
              <div className="vads-u-color--gray">
                Do you need to quickly leave your current living situation?:
              </div>
              {formData['view:isAtRisk']?.needToLeaveHousing ? 'Yes' : 'No'}
            </li>
            {homelessnessContact.name && (
              <>
                <li>
                  <div className="vads-u-color--gray">
                    Please provide the name of a person or place we can call if
                    we need to get in touch with you:
                  </div>
                </li>
                <li>Name: {homelessnessContact.name}</li>
                <li>Phone number: {homelessnessContact.phoneNumber}</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

HousingSituationResponses.propTypes = {
  formData: PropTypes.object,
};
export default HousingSituationResponses;
