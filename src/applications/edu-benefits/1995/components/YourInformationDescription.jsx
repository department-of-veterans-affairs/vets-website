import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isLOA3 } from '~/platform/user/selectors';

// Map benefit type codes to full descriptions
const BENEFIT_TYPE_LABELS = {
  // Post-9/11 GI Bill variants
  chapter33: 'Post-9/11 GI Bill (PGIB, Chapter 33)',
  CH33: 'Post-9/11 GI Bill (PGIB, Chapter 33)',
  CH33_TOE:
    'Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
  CH33_FRY: 'Fry Scholarship (Chapter 33)',

  // Montgomery GI Bill Active Duty
  chapter30: 'Montgomery GI Bill (MGIB-AD, Chapter 30)',
  CH30: 'Montgomery GI Bill (MGIB-AD, Chapter 30)',

  // Montgomery GI Bill Selected Reserve
  chapter1606: 'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
  CH1606: 'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',

  // Dependents' Education Assistance
  chapter35: "Dependents' Education Assistance (DEA, Chapter 35)",
  CH35: "Dependents' Education Assistance (DEA, Chapter 35)",
  DEA: "Dependents' Education Assistance (DEA, Chapter 35)",

  // Legacy mappings (for backward compatibility)
  transferOfEntitlement:
    'Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
  TOE:
    'Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
  fryScholarship: 'Fry Scholarship (Chapter 33)',
  FRY: 'Fry Scholarship (Chapter 33)',
};

export const getBenefitLabel = benefitType => {
  if (!benefitType) {
    return "We couldn't load your current benefit.";
  }
  return BENEFIT_TYPE_LABELS[benefitType] || benefitType;
};

const YourInformationDescription = ({ formData }) => {
  const isLoa3 = useSelector(isLOA3);

  return (
    <div className="vads-u-margin-bottom--4" style={{ maxWidth: '35rem' }}>
      {isLoa3 && (
        <>
          <h2 style={{ fontSize: '30px' }}>Your information</h2>
          <div
            className="usa-summary-box"
            role="region"
            aria-labelledby="summary-box-current-benefit"
            style={{
              backgroundColor: 'white',
              border: '2px solid #919191',
              borderRadius: '4px',
            }}
          >
            <div className="usa-summary-box__body vads-u-padding-x--3 vads-u-padding-top--1 vads-u-padding-bottom--2">
              <h3
                className="usa-summary-box__heading vads-u-margin-top--0"
                id="summary-box-current-benefit"
                style={{ marginBottom: '0.25rem', fontSize: '20px' }}
              >
                Your current benefit
              </h3>
              <div className="usa-summary-box__text">
                <p className="vads-u-margin-y--0">
                  {getBenefitLabel(formData?.currentBenefitType)}
                </p>
              </div>
            </div>
          </div>
          <p className="vads-u-margin-top--2">
            <strong>Note:</strong> If this information is incorrect, contact us
            at <va-link href="https://ask.va.gov/" text="Ask VA" />.
          </p>
        </>
      )}
    </div>
  );
};

YourInformationDescription.propTypes = {
  formData: PropTypes.shape({
    currentBenefitType: PropTypes.string,
  }).isRequired,
};

export default YourInformationDescription;
